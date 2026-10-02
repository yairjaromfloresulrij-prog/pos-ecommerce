import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMarcaDto {
  @ApiProperty({
    example: 'Logitech',
    description: 'Nombre de la marca',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
