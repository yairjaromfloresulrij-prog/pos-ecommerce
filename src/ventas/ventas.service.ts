import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class VentasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVentaDto: CreateVentaDto, usuario: any) {
    const caja = await this.prisma.caja.findFirst({
      where: {
        cajeroId: usuario.sub,
        fechaCierre: null,
      },
    });

    if (!caja) {
      throw new BadRequestException(
        'No tienes una caja abierta para realizar la venta',
      );
    }

    let total = 0;

    for (const detalle of createVentaDto.productos) {
      const producto = await this.prisma.producto.findUnique({
        where: {
          id: detalle.productoId,
        },
      });

      if (!producto) {
        throw new BadRequestException(
          `El producto con id ${detalle.productoId} no existe`,
        );
      }

      const inventario = await this.prisma.inventario.findUnique({
        where: {
          productoId: detalle.productoId,
        },
      });

      if (!inventario) {
        throw new BadRequestException(
          `El producto con id ${detalle.productoId} no tiene inventario`,
        );
      }

      if (inventario.stock < detalle.cantidad) {
        throw new BadRequestException(
          `Stock insuficiente para el producto ${detalle.productoId}. Disponible: ${inventario.stock}, solicitado: ${detalle.cantidad}`,
        );
      }

      total += Number(producto.precioVenta) * detalle.cantidad;
    }

    return this.prisma.$transaction(async (tx) => {
      const venta = await tx.venta.create({
        data: {
          fecha: new Date(),
          total,
          metodoPago: createVentaDto.metodoPago,
          cajaId: caja.id,
        },
      });

      for (const detalle of createVentaDto.productos) {
        const producto = await tx.producto.findUnique({
          where: {
            id: detalle.productoId,
          },
        });

        await tx.detalleVenta.create({
          data: {
            ventaId: venta.id,
            productoId: detalle.productoId,
            cantidad: detalle.cantidad,
            precioUnitario: producto!.precioVenta,
          },
        });

        await tx.inventario.update({
          where: {
            productoId: detalle.productoId,
          },
          data: {
            stock: {
              decrement: detalle.cantidad,
            },
          },
        });
      }

      return venta;
    });
  }

  async findAll(fecha?: string) {
    if (!fecha) {
      return this.prisma.venta.findMany();
    }
    const inicio = new Date(`${fecha}T00:00:00`);
    const fin = new Date(`${fecha}T23:59:59.999`);

    return this.prisma.venta.findMany({
      where: {
        fecha: {
          gte: inicio,
          lte: fin,
        },
      },
    });
  }

  async findOne(id: number) {
    const venta = await this.prisma.venta.findUnique({
      where: { id },
      include: {
        detalles: {
          include: {
            producto: true,
          },
        },
      },
    });

    if (!venta) {
      throw new BadRequestException(`La venta con id ${id} no existe`);
    }

    return venta;
  }
}
