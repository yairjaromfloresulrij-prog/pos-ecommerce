import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DetalleVentaDto {
  @ApiProperty({
    example: 1,
    description: 'ID del producto que se desea vender',
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
