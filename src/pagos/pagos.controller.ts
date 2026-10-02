import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PagosService } from './pagos.service.js';
import { CrearPagoDto } from './dto/crear-pago.dto.js';
import { WebhookPagoDto } from './dto/webhook-pago.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@ApiTags('Pagos')
@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post('crear')
  @ApiBearerAuth()
  @Roles('CLIENTE')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Iniciar un pago',
    description: 'Crea un pago utilizando el total del pedido.',
  })
  @ApiResponse({
    status: 201,
    description: 'Pago creado correctamente.',
  })
  crearPago(
    @Body() crearPagoDto: CrearPagoDto,
    @Request() req: ExpressRequest,
  ) {
    return this.pagosService.crearPago(crearPagoDto.pedidoId, req.user);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Procesar webhook de MockPay',
    description: 'Recibe la notificación del proveedor de pagos.',
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook procesado correctamente.',
  })
  webhook(@Body() data: WebhookPagoDto) {
    return this.pagosService.procesarWebhook(data);
  }
}
