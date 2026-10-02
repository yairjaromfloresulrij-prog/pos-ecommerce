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
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { UpdateEstadoPedidoDto } from './dto/update-pedido.dto.js';

@ApiTags('Pedidos')
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @ApiBearerAuth()
  @Roles('CLIENTE')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Crear un pedido a partir del carrito' })
  @Post()
  create(
    @Body() createPedidoDto: CreatePedidoDto,
    @Request() req: ExpressRequest,
  ) {
    return this.pedidosService.create(createPedidoDto, req.user);
  }
  @ApiOperation({ summary: 'Consultar todos los pedidos' })
  @Get()
  findAll() {
    return this.pedidosService.findAll();
  }
  @ApiOperation({ summary: 'Consultar la cola de pedidos de logística' })
  @Get('logistica')
  findLogistica() {
    return this.pedidosService.findLogistica();
  }
  @ApiOperation({ summary: 'Actualizar el estado de un pedido' })
  @Patch(':id/estado')
  updateEstado(
    @Param('id') id: string,
    @Body() updateEstadoPedidoDto: UpdateEstadoPedidoDto,
  ) {
    return this.pedidosService.updateEstado(+id, updateEstadoPedidoDto.estado);
  }
}
