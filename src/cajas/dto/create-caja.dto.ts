import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class CreateCajaDto {
  @ApiProperty({
    example: 50000,
    description: 'Monto inicial disponible al abrir la caja',
  })
  @IsNumber()
  @IsPositive()
  montoInicial: number;
}
