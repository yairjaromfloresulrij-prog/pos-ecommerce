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
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(RolUsuario)
  rol: RolUsuario;
}
