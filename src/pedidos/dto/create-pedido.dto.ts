import { IsInt, IsPositive } from 'class-validator';
export class CreatePedidoDto {
  @IsInt()
  @IsPositive()
  direccionId: number;
}
