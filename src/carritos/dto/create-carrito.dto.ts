import { IsInt, IsPositive } from 'class-validator';

export class CreateCarritoDto {
  @IsInt()
  @IsPositive()
  productoId: number;

  @IsInt()
  @IsPositive()
  cantidad: number;
}
