import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto.js';
import { UpdateProductoDto } from './dto/update-producto.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ActualizarStockDto } from './dto/actualizar-stock.dto.js';

@Injectable()
export class ProductosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductoDto: CreateProductoDto) {
    const producto = await this.prisma.producto.create({
      data: {
        ...createProductoDto,
        inventario: {
          create: {
            stock: 0,
          },
        },
      },
      include: {
        inventario: true,
      },
    });

    return {
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: Number(producto.precioVenta),
      categoriaId: producto.categoriaId,
      marcaId: producto.marcaId,
      inventario: producto.inventario
        ? {
            stock: producto.inventario.stock,
          }
        : null,
    };
  }

  async findAll(categoriaId?: string) {
    if (categoriaId) {
      const categoria = await this.prisma.categoria.findUnique({
        where: {
          id: Number(categoriaId),
        },
      });

      if (!categoria) {
        throw new NotFoundException('La categoría no existe');
      }
    }

    const productos = await this.prisma.producto.findMany({
      where: {
        activo: true,
        inventario: {
          stock: {
            gt: 0,
          },
        },
        ...(categoriaId
          ? {
              categoriaId: Number(categoriaId),
            }
          : {}),
      },
      include: {
        inventario: true,
      },
    });

    return productos.map((producto) => ({
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: Number(producto.precioVenta),
      categoriaId: producto.categoriaId,
      marcaId: producto.marcaId,
      inventario: producto.inventario
        ? {
            stock: producto.inventario.stock,
          }
        : null,
    }));
  }

  async findOne(id: number) {
    const producto = await this.prisma.producto.findUnique({
      where: {
        id,
      },
      include: {
        inventario: true,
      },
    });

    if (!producto || !producto.activo) {
      throw new NotFoundException('El producto no existe');
    }

    return {
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: Number(producto.precioVenta),
      categoriaId: producto.categoriaId,
      marcaId: producto.marcaId,
      inventario: producto.inventario
        ? {
            stock: producto.inventario.stock,
          }
        : null,
    };
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    const producto = await this.prisma.producto.update({
      where: {
        id,
      },
      data: updateProductoDto,
      include: {
        inventario: true,
      },
    });

    return {
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: Number(producto.precioVenta),
      categoriaId: producto.categoriaId,
      marcaId: producto.marcaId,
      inventario: producto.inventario
        ? {
            stock: producto.inventario.stock,
          }
        : null,
    };
  }

  async actualizarStock(
    productoId: number,
    actualizarStockDto: ActualizarStockDto,
  ) {
    const producto = await this.prisma.producto.findUnique({
      where: {
        id: productoId,
      },
      include: {
        inventario: true,
      },
    });

    if (!producto || !producto.activo) {
      throw new NotFoundException('El producto no existe');
    }

    const inventario = await this.prisma.inventario.update({
      where: {
        productoId,
      },
      data: {
        stock: {
          increment: actualizarStockDto.cantidad,
        },
      },
    });

    return {
      productoId,
      stock: inventario.stock,
      mensaje: 'Stock actualizado correctamente',
    };
  }

  async remove(id: number) {
    const producto = await this.prisma.producto.update({
      where: {
        id,
      },
      data: {
        activo: false,
      },
    });

    return {
      id: producto.id,
      nombre: producto.nombre,
      activo: producto.activo,
      mensaje: 'Producto desactivado correctamente',
    };
  }
}
