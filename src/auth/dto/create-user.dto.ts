import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export enum RolUsuario {
  ADMIN = 'ADMIN',
  CAJERO = 'CAJERO',
}

export class CreateUserDto {
  @ApiProperty({
    example: 'cajero@gmail.com',
    description: 'Correo electrónico del usuario interno',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Contraseña del usuario',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'CAJERO',
    enum: RolUsuario,
    description: 'Rol que tendrá el usuario interno',
  })
  @IsEnum(RolUsuario)
  rol: RolUsuario;
}
