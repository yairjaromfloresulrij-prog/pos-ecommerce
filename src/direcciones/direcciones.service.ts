import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDireccionDto } from './dto/create-direccione.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DireccionesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDireccionDto: CreateDireccionDto, usuario: any) {
    const cliente = await this.prisma.clienteWeb.findUnique({
      where: { usuarioId: usuario.sub },
    });

    if (!cliente) {
      throw new NotFoundException('El cliente no existe');
    }

    return this.prisma.direccion.create({
      data: {
        ...createDireccionDto,
        clienteId: cliente.id,
      },
    });
  }

  async findMisDirecciones(usuario: any) {
    const cliente = await this.prisma.clienteWeb.findUnique({
      where: { usuarioId: usuario.sub },
    });

    if (!cliente) {
      throw new NotFoundException('El cliente no existe');
    }

    return this.prisma.direccion.findMany({
      where: { clienteId: cliente.id },
    });
  }
}
