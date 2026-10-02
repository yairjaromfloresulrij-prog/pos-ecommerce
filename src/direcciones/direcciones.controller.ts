import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateDireccionDto } from './dto/create-direccione.dto.js';
import { DireccionesService } from './direcciones.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
@ApiTags('Direcciones')
@Controller('direcciones')
export class DireccionesController {
  constructor(private readonly direccionesService: DireccionesService) {}

  @Post()
  @ApiBearerAuth()
  @Roles('CLIENTE')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Crear una dirección',
    description: 'Crea una nueva dirección para un cliente web.',
  })
  @ApiResponse({
    status: 201,
    description: 'Dirección creada correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'El cliente no existe.',
  })
  @ApiResponse({
    status: 400,
    description: 'Los datos enviados no son válidos.',
  })
  create(
    @Body() createDireccionDto: CreateDireccionDto,
    @Request() req: ExpressRequest,
  ) {
    return this.direccionesService.create(createDireccionDto, req.user);
  }

  @Get('mis-direcciones')
  @ApiBearerAuth()
  @Roles('CLIENTE')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Consultar mis direcciones',
    description: 'Devuelve únicamente las direcciones del cliente autenticado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Direcciones del cliente obtenidas correctamente.',
  })
  findMisDirecciones(@Request() req: ExpressRequest) {
    return this.direccionesService.findMisDirecciones(req.user);
  }
}
