import {
  Controller,
  Param,
  Patch,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { PedidosService } from './pedidos.service.js';
import { CreatePedidoDto } from './dto/create-pedido.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateEstadoPedidoDto } from './dto/update-pedido.dto.js';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @ApiBearerAuth()
  @Roles('CLIENTE')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(
    @Body() createPedidoDto: CreatePedidoDto,
    @Request() req: ExpressRequest,
  ) {
    return this.pedidosService.create(createPedidoDto, req.user);
  }

  @Get()
  findAll() {
    return this.pedidosService.findAll();
  }
  @Get('logistica')
  findLogistica() {
    return this.pedidosService.findLogistica();
  }
  @Patch(':id/estado')
  updateEstado(
    @Param('id') id: string,
    @Body() updateEstadoPedidoDto: UpdateEstadoPedidoDto,
  ) {
    return this.pedidosService.updateEstado(+id, updateEstadoPedidoDto.estado);
  }
}
