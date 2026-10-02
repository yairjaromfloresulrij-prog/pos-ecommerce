import { IsNumber, IsPositive } from 'class-validator';
export class CreateCajaDto {
  @IsNumber()
  @IsPositive()
  montoInicial: number;
}
