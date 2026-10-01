import { Module } from '@nestjs/common';
import { CarritosService } from './carritos.service.js';
import { CarritosController } from './carritos.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [CarritosController],
  providers: [CarritosService],
})
export class CarritosModule {}
