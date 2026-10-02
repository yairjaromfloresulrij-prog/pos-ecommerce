import {
  ConflictException,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCajaDto } from './dto/create-caja.dto.js';
import { CerrarCajaDto } from './dto/cerrar-caja.dto.js';

@Injectable()
export class CajasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCajaDto: CreateCajaDto, usuario: any) {
    const cajaAbierta = await this.prisma.caja.findFirst({
      where: {
        cajeroId: usuario.sub,
        fechaCierre: null,
      },
    });

    if (cajaAbierta) {
      throw new ConflictException('Ya tienes una caja abierta');
    }

    return this.prisma.caja.create({
      data: {
        cajeroId: usuario.sub,
        fechaApertura: new Date(),
        montoInicial: createCajaDto.montoInicial,
      },
    });
  }

  async findAbierta(usuario: any) {
    return this.prisma.caja.findFirst({
      where: {
        cajeroId: usuario.sub,
        fechaCierre: null,
      },
    });
  }
  async findAll() {
    return this.prisma.caja.findMany({
      include: {
        cajero: {
          select: {
            id: true,
            email: true,
            rol: true,
          },
        },
        ventas: true,
      },
      orderBy: {
        fechaApertura: 'desc',
      },
    });
  }
  async cerrar(id: number, cerrarCajaDto: CerrarCajaDto, usuario: any) {
    const caja = await this.prisma.caja.findFirst({
      where: {
        id,
        cajeroId: usuario.sub,
        fechaCierre: null,
      },
    });

    if (!caja) {
      throw new NotFoundException(
        'La caja no existe, ya está cerrada o no te pertenece',
      );
    }

    const ventas = await this.prisma.venta.findMany({
      where: {
        cajaId: caja.id,
        metodoPago: 'EFECTIVO',
      },
    });

    let totalEfectivo = 0;

    for (const venta of ventas) {
      totalEfectivo += Number(venta.total);
    }

    const efectivoEsperado = Number(caja.montoInicial) + totalEfectivo;

    const diferencia = cerrarCajaDto.montoFinal - efectivoEsperado;

    if (cerrarCajaDto.montoFinal < 0) {
      throw new BadRequestException('El monto final no puede ser negativo');
    }

    const cajaCerrada = await this.prisma.caja.update({
      where: { id: caja.id },
      data: {
        fechaCierre: new Date(),
        montoFinal: cerrarCajaDto.montoFinal,
      },
    });

    return {
      caja: cajaCerrada,
      totalVentasEfectivo: totalEfectivo,
      efectivoEsperado,
      efectivoReportado: cerrarCajaDto.montoFinal,
      diferencia,
    };
  }
}
