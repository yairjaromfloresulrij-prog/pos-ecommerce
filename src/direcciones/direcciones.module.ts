import { Module } from '@nestjs/common';
import { DireccionesService } from './direcciones.service.js';
import { DireccionesController } from './direcciones.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [DireccionesController],
  providers: [DireccionesService],
})
export class DireccionesModule {}
