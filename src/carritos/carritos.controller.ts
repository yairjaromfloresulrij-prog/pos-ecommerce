import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { CarritosService } from './carritos.service.js';
import { CreateCarritoDto } from './dto/create-carrito.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('carritos')
export class CarritosController {
  constructor(private readonly carritosService: CarritosService) {}

  @ApiBearerAuth()
  @Post()
  @Roles(`CLIENTE`)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(
    @Body() createCarritoDto: CreateCarritoDto,
    @Request() req: ExpressRequest,
  ) {
    return this.carritosService.create(createCarritoDto, req.user);
  }
  @ApiBearerAuth()
  @Get()
  @Roles(`CLIENTE`)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(@Request() req: ExpressRequest) {
    return this.carritosService.findOne(req.user);
  }
}
