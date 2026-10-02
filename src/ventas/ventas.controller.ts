import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import {
  ApiBearerAuth,
  ApiQuery,
  ApiOperation,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { VentasService } from './ventas.service.js';
import { CreateVentaDto } from './dto/create-venta.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@ApiTags('Ventas')
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @ApiBearerAuth()
  @Roles('CAJERO')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Registrar una venta en el POS',
  })
  @Post()
  create(
    @Body() createVentaDto: CreateVentaDto,
    @Request() req: ExpressRequest,
  ) {
    return this.ventasService.create(createVentaDto, req.user);
  }

  @ApiBearerAuth()
  @Roles('ADMIN', 'CAJERO')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiQuery({
    name: 'fecha',
    required: false,
    example: '2026-09-30',
    description: 'Filtra las ventas realizadas en una fecha específica',
  })
  @ApiOperation({
    summary: 'Consultar las ventas del POS',
  })
  @Get()
  findAll(@Query(`fecha`) fecha?: string) {
    return this.ventasService.findAll(fecha);
  }

  @ApiBearerAuth()
  @Roles('ADMIN', 'CAJERO')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID de la venta que se desea consultar',
  })
  @ApiOperation({
    summary: 'Consultar una venta por su ID',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ventasService.findOne(+id);
  }
}
