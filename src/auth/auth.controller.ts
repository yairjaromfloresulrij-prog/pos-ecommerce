import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { Roles } from './decorators/roles.decorator.js';
import { RegisterDto } from './dto/register.dto.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({ summary: 'Registrar un nuevo cliente' })
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  @ApiBearerAuth()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Crear un usuario interno' })
  @Post('users')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }
  @ApiOperation({ summary: 'Iniciar sesión' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const usuario = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!usuario) {
      return null;
    }

    return this.authService.login(usuario);
  }
  @ApiBearerAuth()
  @Roles(`ADMIN`)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Consultar el perfil del usuario autenticado' })
  @Get('profile')
  profile(@Request() req: any) {
    return req.user;
  }
}
