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
  ApiParam,
  ApiQuery,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { ProductoResponseDto } from './dto/producto-response.dto.js';
import { ProductoDeleteResponseDto } from './dto/producto-delete-response.dto.js';
import { ActualizarStockDto } from './dto/actualizar-stock.dto.js';

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
  @ApiOperation({
    summary: 'Crear un nuevo producto',
  })
  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }
  @ApiBearerAuth()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID del producto al que se desea agregar stock',
  })
  @ApiOperation({
    summary: 'Agregar stock a un producto',
    description:
      'Aumenta la cantidad disponible del inventario de un producto.',
  })
  @ApiResponse({ status: 200, description: 'Stock actualizado correctamente.' })
  @ApiResponse({
    status: 400,
    description: 'La cantidad debe ser un número entero mayor que 0.',
  })
  @ApiResponse({ status: 404, description: 'El producto no existe.' })
  @Patch(':id/stock')
  actualizarStock(
    @Param('id') id: string,
    @Body() actualizarStockDto: ActualizarStockDto,
  ) {
    return this.productosService.actualizarStock(
      Number(id),
      actualizarStockDto,
    );
  }
  @ApiQuery({
    name: 'categoriaId',
    required: false,
    type: Number,
    example: 1,
    description: 'Filtra los productos por el ID de la categoría',
  })
  @ApiOkResponse({
    type: ProductoResponseDto,
    isArray: true,
  })
  @ApiOperation({
    summary: 'Consultar el catálogo de productos',
  })
  @Get()
  findAll(@Query(`categoriaId`) categoriaId?: string) {
    return this.productosService.findAll(categoriaId);
  }

  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID del producto que se desea consultar',
  })
  @ApiOkResponse({
    type: ProductoResponseDto,
  })
  @ApiOperation({
    summary: 'Consultar un producto por su ID',
  })
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
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID del producto que se desea actualizar',
  })
  @ApiOkResponse({
    type: ProductoResponseDto,
  })
  @ApiOperation({
    summary: 'Actualizar un producto',
  })
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
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID del producto que se desea desactivar',
  })
  @ApiOkResponse({
    type: ProductoDeleteResponseDto,
  })
  @ApiOperation({
    summary: 'Desactivar un producto',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productosService.remove(+id);
  }
}
