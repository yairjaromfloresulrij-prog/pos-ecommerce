import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'cliente@gmail.com',
    description: 'Correo electrónico del cliente',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Contraseña del cliente',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'Juan',
    description: 'Nombre del cliente',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  nombre: string;

  @ApiProperty({
    example: 'Pérez',
    description: 'Apellido del cliente',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  apellido: string;

  @ApiProperty({
    example: '1123456789',
    description: 'Número de teléfono del cliente',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  @MaxLength(20)
  telefono: string;
}
