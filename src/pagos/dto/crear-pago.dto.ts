import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CrearPagoDto {
  @ApiProperty({
    example: 1,
    description: 'ID del pedido que se quiere pagar',
  })
  @IsInt()
  @IsPositive()
  pedidoId: number;
}
