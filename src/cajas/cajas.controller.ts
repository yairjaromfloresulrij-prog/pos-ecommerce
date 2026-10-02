import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { CajasService } from './cajas.service.js';
import { CreateCajaDto } from './dto/create-caja.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CerrarCajaDto } from './dto/cerrar-caja.dto.js';

@ApiTags('Cajas')
@Controller('cajas')
export class CajasController {
  constructor(private readonly cajasService: CajasService) {}

  @ApiBearerAuth()
  @Roles('CAJERO')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Abrir una nueva caja' })
  @Post()
  create(@Body() createCajaDto: CreateCajaDto, @Request() req: ExpressRequest) {
    return this.cajasService.create(createCajaDto, req.user);
  }

  @ApiBearerAuth()
  @Roles('CAJERO')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Consultar la caja abierta del cajero' })
  @Get('abierta')
  findAbierta(@Request() req: ExpressRequest) {
    return this.cajasService.findAbierta(req.user);
  }
  @ApiBearerAuth()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Consultar todas las cajas y sus ventas' })
  @Get()
  findAll() {
    return this.cajasService.findAll();
  }
  @ApiBearerAuth()
  @Roles('CAJERO')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Cerrar una caja y realizar la conciliación' })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID de la caja que se desea cerrar',
  })
  @Patch(':id/cerrar')
  cerrar(
    @Param('id') id: string,
    @Body() cerrarCajaDto: CerrarCajaDto,
    @Request() req: ExpressRequest,
  ) {
    return this.cajasService.cerrar(+id, cerrarCajaDto, req.user);
  }
}
