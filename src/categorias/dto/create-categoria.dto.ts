import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoriaDto {
  @ApiProperty({
    example: 'Ropa',
    description: 'Nombre de la categoría',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
