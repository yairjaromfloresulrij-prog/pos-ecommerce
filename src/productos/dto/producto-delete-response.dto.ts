import { ApiProperty } from '@nestjs/swagger';

export class ProductoDeleteResponseDto {
  @ApiProperty({
    example: 1,
    description: 'ID del producto desactivado',
  })
  id: number;

  @ApiProperty({
    example: 'Mouse Gamer',
    description: 'Nombre del producto desactivado',
  })
  nombre: string;

  @ApiProperty({
    example: false,
    description: 'Indica si el producto se encuentra activo',
  })
  activo: boolean;

  @ApiProperty({
    example: 'Producto desactivado correctamente',
    description: 'Mensaje de confirmación de la operación',
  })
  mensaje: string;
}
