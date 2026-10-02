import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
export class CreateDireccionDto {
  @ApiProperty({
    example: 1,
    description: 'ID del cliente al que pertenece la dirección',
  })
  @IsInt()
  clienteId: number;
  @ApiProperty({ example: 'Av. Rivadavia', description: 'Nombre de la calle' })
  @IsString()
  @IsNotEmpty()
  calle: string;
  @ApiProperty({ example: '1234', description: 'Número de la dirección' })
  @IsString()
  @IsNotEmpty()
  numero: string;
  @ApiProperty({
    example: 'Morón',
    description: 'Ciudad donde se encuentra la dirección',
  })
  @IsString()
  @IsNotEmpty()
  ciudad: string;
  @ApiProperty({
    example: 'Casa con portón negro',
    description: 'Referencia para facilitar la ubicación',
  })
  @IsString()
  @IsNotEmpty()
  referencia: string;
}
