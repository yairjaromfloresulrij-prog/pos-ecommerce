import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { EstadoPedido } from '../../generated/prisma/client.js';

export class UpdateEstadoPedidoDto {
  @ApiProperty({
    example: 'CONFIRMADO',
    enum: EstadoPedido,
    description: 'Nuevo estado que tendrá el pedido',
  })
  @IsEnum(EstadoPedido)
  estado: EstadoPedido;
}
