import { IsInt, IsPositive } from 'class-validator';

export class DetalleVentaDto {
  @IsInt()
  @IsPositive()
  productoId: number;

  @IsInt()
  @IsPositive()
  cantidad: number;
}
