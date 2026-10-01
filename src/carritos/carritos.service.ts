import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCarritoDto } from './dto/create-carrito.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProductoScalarFieldEnum } from '../generated/prisma/internal/prismaNamespace.js';

@Injectable()
export class CarritosService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCarritoDto: CreateCarritoDto, usuario: any) {
    const cliente = await this.prisma.clienteWeb.findUnique({
      where: {
        usuarioId: usuario.sub,
      },
    });
    if (!cliente) {
      throw new NotFoundException(`el cliente web no existe`);
    }
    const producto = await this.prisma.producto.findUnique({
      where: {
        id: createCarritoDto.productoId,
      },
    });
    if (!producto || !producto.activo) {
      throw new NotFoundException(`el producto no existe`);
    }
    const inventario = await this.prisma.inventario.findUnique({
      where: {
        productoId: createCarritoDto.productoId,
      },
    });
    if (!inventario) {
      throw new NotFoundException(`el producto no tiene inventario`);
    }
    if (inventario.stock < createCarritoDto.cantidad) {
      throw new BadRequestException(
        `stock insuficiente. disponible: ${inventario.stock}`,
      );
    }
    let carrito = await this.prisma.carrito.findUnique({
      where: {
        clienteId: cliente.id,
      },
    });
    if (!carrito) {
      carrito = await this.prisma.carrito.create({
        data: {
          clienteId: cliente.id,
          creadoEn: new Date(),
          actualizadoEn: new Date(),
        },
      });
    }
    const detalleExistente = await this.prisma.detalleCarrito.findFirst({
      where: {
        carritoId: carrito.id,
        productoId: createCarritoDto.productoId,
      },
    });
    if (
      detalleExistente &&
      inventario.stock < detalleExistente.cantidad + createCarritoDto.cantidad
    ) {
      throw new BadRequestException(
        `stock insuficiente. disponible: ${inventario.stock}`,
      );
    }
    if (detalleExistente) {
      await this.prisma.detalleCarrito.update({
        where: {
          id: detalleExistente.id,
        },
        data: {
          cantidad: detalleExistente.cantidad + createCarritoDto.cantidad,
        },
      });
    } else {
      await this.prisma.detalleCarrito.create({
        data: {
          carritoId: carrito.id,
          productoId: createCarritoDto.productoId,
          cantidad: createCarritoDto.cantidad,
        },
      });
    }
    return producto;
  }

  async findOne(usuario: any) {
    const cliente = await this.prisma.clienteWeb.findUnique({
      where: {
        usuarioId: usuario.sub,
      },
    });
    if (!cliente) {
      throw new NotFoundException(`el cliente web no existe`);
    }
    const carrito = await this.prisma.carrito.findUnique({
      where: {
        clienteId: cliente.id,
      },
      include: {
        detalles: {
          include: {
            producto: true,
          },
        },
      },
    });
    return carrito;
  }
}
