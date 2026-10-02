import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ProductosService } from './productos.service.js';
import { CreateProductoDto } from './dto/create-producto.dto.js';
import { UpdateProductoDto } from './dto/update-producto.dto.js';
import {
  ApiBearerAuth,
  ApiQuery,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { ProductoResponseDto } from './dto/producto-response.dto.js';
import { ProductoDeleteResponseDto } from './dto/producto-delete-response.dto.js';
@ApiTags('Productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}
  @ApiBearerAuth()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({
    type: ProductoResponseDto,
  })
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }
  @ApiQuery({
    name: 'categoriaId',
    required: false,
    type: Number,
  })
  @ApiOkResponse({
    type: ProductoResponseDto,
    isArray: true,
  })
  @ApiOperation({ summary: 'Consultar el catálogo de productos' })
  @Get()
  findAll(@Query(`categoriaId`) categoriaId?: string) {
    return this.productosService.findAll(categoriaId);
  }
  @ApiOkResponse({
    type: ProductoResponseDto,
  })
  @ApiOperation({ summary: 'Consultar un producto por su ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    const idNumero = Number(id);

    if (!Number.isInteger(idNumero) || idNumero <= 0 || idNumero > 2147483647) {
      throw new BadRequestException(
        'El ID del producto no es válido: debe ser un número entero dentro del rango permitido.',
      );
    }

    return this.productosService.findOne(idNumero);
  }
  @ApiBearerAuth()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({
    type: ProductoResponseDto,
  })
  @ApiOperation({ summary: 'Actualizar un producto' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productosService.update(+id, updateProductoDto);
  }
  @ApiBearerAuth()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({
    type: ProductoDeleteResponseDto,
  })
  @ApiOperation({ summary: 'Desactivar un producto' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productosService.remove(+id);
  }
}
