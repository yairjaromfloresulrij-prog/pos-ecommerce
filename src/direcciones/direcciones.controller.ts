import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateDireccionDto } from './dto/create-direccione.dto.js';
import { DireccionesService } from './direcciones.service.js';
@ApiTags('Direcciones')
@Controller('direcciones')
export class DireccionesController {
  constructor(private readonly direccionesService: DireccionesService) {}
  @Post()
  @ApiOperation({
    summary: 'Crear una dirección',
    description: 'Crea una nueva dirección para un cliente web.',
  })
  @ApiResponse({ status: 201, description: 'Dirección creada correctamente.' })
  @ApiResponse({ status: 404, description: 'El cliente no existe.' })
  @ApiResponse({
    status: 400,
    description: 'Los datos enviados no son válidos.',
  })
  create(@Body() createDireccionDto: CreateDireccionDto) {
    return this.direccionesService.create(createDireccionDto);
  }
}
