import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        email,
      },
    });

    if (!usuario) {
      return null;
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return null;
    }

    return usuario;
  }

  async login(usuario: any) {
    const payload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async createUser(createUserDto: CreateUserDto) {
    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (usuarioExistente) {
      throw new ConflictException('El email ya está registrado');
    }

    const passwordHasheada = await bcrypt.hash(createUserDto.password, 10);

    const usuario = await this.prisma.usuario.create({
      data: {
        email: createUserDto.email,
        password: passwordHasheada,
        rol: createUserDto.rol,
      },
    });

    return {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    };
  }

  async register(registerDto: RegisterDto) {
    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: {
        email: registerDto.email,
      },
    });

    if (usuarioExistente) {
      throw new ConflictException('El email ya está registrado');
    }

    const passwordHasheada = await bcrypt.hash(registerDto.password, 10);

    const resultado = await this.prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: {
          email: registerDto.email,
          password: passwordHasheada,
          rol: 'CLIENTE',
        },
      });

      const clienteWeb = await tx.clienteWeb.create({
        data: {
          usuarioId: usuario.id,
          nombre: registerDto.nombre,
          apellido: registerDto.apellido,
          telefono: registerDto.telefono,
        },
      });

      return {
        usuario,
        clienteWeb,
      };
    });
    return {
      id: resultado.clienteWeb.id,
      email: resultado.usuario.email,
      nombre: resultado.clienteWeb.nombre,
      apellido: resultado.clienteWeb.apellido,
      telefono: resultado.clienteWeb.telefono,
      rol: resultado.usuario.rol,
    };
  }
}
