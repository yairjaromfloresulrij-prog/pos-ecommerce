import { IsEnum } from 'class-validator';
import { EstadoPedido } from '../../generated/prisma/client.js';

export class UpdateEstadoPedidoDto {
  @IsEnum(EstadoPedido)
  estado: EstadoPedido;
}
