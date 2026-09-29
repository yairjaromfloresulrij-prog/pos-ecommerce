import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service.js';
import { ProductosController } from './productos.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
