import { ApiProperty } from '@nestjs/swagger';

export class ProductoResponseDto {
  @ApiProperty({
    example: 1,
    description: 'ID del producto',
  })
  id: number;

  @ApiProperty({
    example: 'Mouse Gamer',
    description: 'Nombre del producto',
  })
  nombre: string;

  @ApiProperty({
    example: 'Mouse gamer con sensor óptico',
    description: 'Descripción del producto',
  })
  descripcion: string;

  @ApiProperty({
    example: 25000,
    description: 'Precio de venta actual del producto',
  })
  precio: number;

  @ApiProperty({
    example: 1,
    description: 'ID de la categoría del producto',
  })
  categoriaId: number;

  @ApiProperty({
    example: 1,
    description: 'ID de la marca del producto',
  })
  marcaId: number;

  @ApiProperty({
    example: {
      stock: 20,
    },
    nullable: true,
    description: 'Stock disponible del producto',
  })
  inventario: {
    stock: number;
  } | null;
}
