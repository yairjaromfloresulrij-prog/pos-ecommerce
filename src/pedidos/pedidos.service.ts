import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { EstadoPedido } from '../generated/prisma/enums.js';

@Injectable()
export class PedidosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPedidoDto: CreatePedidoDto, usuario: any) {
    const cliente = await this.prisma.clienteWeb.findUnique({
      where: {
        usuarioId: usuario.sub,
      },
    });

    if (!cliente) {
      throw new NotFoundException(`el cliente web no existe`);
    }

    const direccion = await this.prisma.direccion.findFirst({
      where: {
        id: createPedidoDto.direccionId,
        clienteId: cliente.id,
      },
    });

    if (!direccion) {
      throw new NotFoundException(
        `la direccion no existe o no pertenece al cliente`,
      );
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

    if (!carrito || carrito.detalles.length == 0) {
      throw new BadRequestException(`el carrito esta vacio`);
    }

    for (const detalle of carrito.detalles) {
      const inventario = await this.prisma.inventario.findUnique({
        where: {
          productoId: detalle.productoId,
        },
      });

      if (!inventario) {
        throw new BadRequestException(
          `el producto ${detalle.productoId} no tiene inventario`,
        );
      }

      if (inventario.stock < detalle.cantidad) {
        throw new BadRequestException(
          `stock insuficiente para el producto ${detalle.productoId}. disponible: ${inventario.stock}`,
        );
      }
    }

    let total = 0;

    for (const detalle of carrito.detalles) {
      total += Number(detalle.producto.precioVenta) * detalle.cantidad;
    }

    return this.prisma.$transaction(async (tx) => {
      const pedido = await tx.pedido.create({
        data: {
          clienteId: cliente.id,
          direccionId: direccion.id,
          fecha: new Date(),
          estado: 'PENDIENTE',
          total,
        },
      });

      for (const detalle of carrito.detalles) {
        await tx.detallePedido.create({
          data: {
            pedidoId: pedido.id,
            productoId: detalle.productoId,
            cantidad: detalle.cantidad,
            precioUnitario: detalle.producto.precioVenta,
          },
        });
      }

      for (const detalle of carrito.detalles) {
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

      await tx.detalleCarrito.deleteMany({
        where: {
          carritoId: carrito.id,
        },
      });

      await tx.carrito.update({
        where: {
          id: carrito.id,
        },
        data: {
          actualizadoEn: new Date(),
        },
      });
      return pedido;
    });
  }
  findAll() {
    return this.prisma.pedido.findMany({
      include: {
        cliente: true,
        direccion: true,
        detalles: {
          include: {
            producto: true,
          },
        },
      },
    });
  }
  async updateEstado(id: number, estado: EstadoPedido) {
    const pedido = await this.prisma.pedido.findUnique({
      where: {
        id,
      },
    });
    if (!pedido) {
      throw new NotFoundException(`el pedido no existe`);
    }
    if (pedido.estado === `ENTREGADO` || pedido.estado == `CANCELADO`) {
      throw new BadRequestException(
        `no se puede cambiar le estado de un pedido finalizado`,
      );
    }
    const transicionesPermitidas: Record<EstadoPedido, EstadoPedido[]> = {
      PENDIENTE: ['PAGADO', 'CANCELADO'],
      PAGADO: ['EN_TRANSITO', 'CANCELADO'],
      EN_TRANSITO: ['ENTREGADO'],
      ENTREGADO: [],
      CANCELADO: [],
    };
    const estadosPermitidos = transicionesPermitidas[pedido.estado];

    if (!estadosPermitidos.includes(estado)) {
      throw new BadRequestException(
        `No se puede cambiar el pedido de ${pedido.estado} a ${estado}`,
      );
    }
    return this.prisma.pedido.update({
      where: {
        id,
      },
      data: {
        estado,
      },
    });
  }
  findLogistica() {
    return this.prisma.pedido.findMany({
      where: {
        estado: {
          in: ['PENDIENTE', 'PAGADO', 'EN_TRANSITO'],
        },
      },
      include: {
        cliente: true,
        direccion: true,
        detalles: {
          include: {
            producto: true,
          },
        },
      },
      orderBy: {
        fecha: 'asc',
      },
    });
  }
}
