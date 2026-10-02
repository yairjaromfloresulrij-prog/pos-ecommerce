import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreatePedidoDto {
  @ApiProperty({
    example: 1,
    description: 'ID de la dirección donde se entregará el pedido',
  })
  @IsInt()
  @IsPositive()
  direccionId: number;
}
