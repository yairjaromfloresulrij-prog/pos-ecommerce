import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreateCarritoDto {
  @ApiProperty({
    example: 3,
    description: 'ID del producto que se desea agregar al carrito',
  })
  @IsInt()
  @IsPositive()
  productoId: number;

  @ApiProperty({
    example: 2,
    description: 'Cantidad de unidades del producto',
  })
  @IsInt()
  @IsPositive()
  cantidad: number;
}
