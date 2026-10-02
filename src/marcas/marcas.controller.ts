import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { MarcasService } from './marcas.service.js';
import { CreateMarcaDto } from './dto/create-marca.dto.js';
import { UpdateMarcaDto } from './dto/update-marca.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@ApiTags('Marcas')
@Controller('marcas')
export class MarcasController {
  constructor(private readonly marcasService: MarcasService) {}

  @ApiBearerAuth()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Crear una marca' })
  @Post()
  create(@Body() createMarcaDto: CreateMarcaDto) {
    return this.marcasService.create(createMarcaDto);
  }

  @ApiOperation({ summary: 'Consultar todas las marcas' })
  @Get()
  findAll() {
    return this.marcasService.findAll();
  }

  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID de la marca',
  })
  @ApiOperation({ summary: 'Consultar una marca por ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marcasService.findOne(+id);
  }

  @ApiBearerAuth()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID de la marca',
  })
  @ApiOperation({ summary: 'Actualizar una marca' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarcaDto: UpdateMarcaDto) {
    return this.marcasService.update(+id, updateMarcaDto);
  }

  @ApiBearerAuth()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID de la marca',
  })
  @ApiOperation({ summary: 'Eliminar una marca' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marcasService.remove(+id);
  }
}
