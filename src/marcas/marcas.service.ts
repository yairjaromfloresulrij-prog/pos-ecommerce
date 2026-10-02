import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateMarcaDto } from './dto/create-marca.dto.js';
import { UpdateMarcaDto } from './dto/update-marca.dto.js';

@Injectable()
export class MarcasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMarcaDto: CreateMarcaDto) {
    const marcaExistente = await this.prisma.marca.findUnique({
      where: {
        nombre: createMarcaDto.nombre,
      },
    });

    if (marcaExistente) {
      throw new ConflictException('La marca ya existe');
    }

    return this.prisma.marca.create({
      data: createMarcaDto,
    });
  }

  findAll() {
    return this.prisma.marca.findMany({
      include: {
        productos: true,
      },
    });
  }

  async findOne(id: number) {
    const marca = await this.prisma.marca.findUnique({
      where: {
        id,
      },
      include: {
        productos: true,
      },
    });

    if (!marca) {
      throw new NotFoundException('La marca no existe');
    }

    return marca;
  }

  async update(id: number, updateMarcaDto: UpdateMarcaDto) {
    await this.findOne(id);

    return this.prisma.marca.update({
      where: {
        id,
      },
      data: updateMarcaDto,
    });
  }

  async remove(id: number) {
    const marca = await this.prisma.marca.findUnique({
      where: { id },
      include: {
        productos: true,
      },
    });

    if (!marca) {
      throw new NotFoundException('La marca no existe');
    }

    if (marca.productos.length > 0) {
      throw new ConflictException(
        'No se puede eliminar la marca porque tiene productos asociados',
      );
    }

    return this.prisma.marca.delete({
      where: { id },
    });
  }
}
