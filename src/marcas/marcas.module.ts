import { Module } from '@nestjs/common';
import { MarcasController } from './marcas.controller.js';
import { MarcasService } from './marcas.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [MarcasController],
  providers: [MarcasService],
})
export class MarcasModule {}
