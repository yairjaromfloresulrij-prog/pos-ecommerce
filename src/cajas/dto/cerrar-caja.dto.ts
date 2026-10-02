import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class CerrarCajaDto {
  @ApiProperty({
    example: 100000,
    description: 'Monto final de efectivo contado al cerrar la caja',
  })
  @IsNumber()
  @IsPositive()
  montoFinal: number;
}
