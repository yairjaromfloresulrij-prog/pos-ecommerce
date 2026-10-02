import { Module } from '@nestjs/common';
import { CajasService } from './cajas.service.js';
import { CajasController } from './cajas.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [CajasController],
  providers: [CajasService],
})
export class CajasModule {}
