import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { VentasService } from './ventas.service.js';
import { CreateVentaDto } from './dto/create-venta.dto.js';
import { UpdateVentaDto } from './dto/update-venta.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @ApiBearerAuth()
  @Roles('CAJERO')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(
    @Body() createVentaDto: CreateVentaDto,
    @Request() req: ExpressRequest,
  ) {
    return this.ventasService.create(createVentaDto, req.user);
  }
  @ApiQuery({
    name: 'fecha',
    required: false,
    example: '2026-09-30',
  })
  @Get()
  findAll(@Query(`fecha`) fecha?: string) {
    return this.ventasService.findAll(fecha);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ventasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVentaDto: UpdateVentaDto) {
    return this.ventasService.update(+id, updateVentaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ventasService.remove(+id);
  }
}
