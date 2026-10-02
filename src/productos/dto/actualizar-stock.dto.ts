import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class ActualizarStockDto {
  @ApiProperty({
    example: 20,
    description: 'Cantidad de unidades que se desean agregar al stock',
  })
  @IsInt()
  @Min(1)
  cantidad: number;
}
