import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  IsPositive,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductoDto {
  @ApiProperty({
    example: 'Mouse Gamer',
    description: 'Nombre del producto',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  nombre: string;

  @ApiProperty({
    example: 'Mouse gamer con sensor óptico',
    description: 'Descripción del producto',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(500)
  descripcion: string;

  @ApiProperty({
    example: 15000,
    description: 'Precio de compra del producto',
  })
  @IsNumber()
  @IsPositive()
  precioCompra: number;

  @ApiProperty({
    example: 25000,
    description: 'Precio de venta del producto',
  })
  @IsNumber()
  @IsPositive()
  precioVenta: number;

  @ApiProperty({
    example: 1,
    description: 'ID de la categoría del producto',
  })
  @IsInt()
  @IsPositive()
  categoriaId: number;

  @ApiProperty({
    example: 1,
    description: 'ID de la marca del producto',
  })
  @IsInt()
  @IsPositive()
  marcaId: number;
}
