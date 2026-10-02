import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDireccionDto } from './dto/create-direccione.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
@Injectable()
export class DireccionesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createDireccionDto: CreateDireccionDto) {
    const cliente = await this.prisma.clienteWeb.findUnique({
      where: { id: createDireccionDto.clienteId },
    });
    if (!cliente) {
      throw new NotFoundException('El cliente no existe');
    }
    return this.prisma.direccion.create({ data: createDireccionDto });
  }
}
