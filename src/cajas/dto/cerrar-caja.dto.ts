import { IsNumber, IsPositive } from 'class-validator';

export class CerrarCajaDto {
  @IsNumber()
  @IsPositive()
  montoFinal: number;
}
