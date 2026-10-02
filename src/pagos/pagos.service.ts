import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadGatewayException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service.js';
import { WebhookPagoDto } from './dto/webhook-pago.dto.js';

@Injectable()
export class PagosService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  async crearPago(pedidoId: number, usuario: any) {
    const cliente = await this.prisma.clienteWeb.findUnique({
      where: {
        usuarioId: usuario.sub,
      },
    });

    if (!cliente) {
      throw new NotFoundException('El cliente web no existe');
    }

    const pedido = await this.prisma.pedido.findUnique({
      where: {
        id: pedidoId,
      },
    });

    if (!pedido) {
      throw new NotFoundException('El pedido no existe');
    }

    if (pedido.clienteId !== cliente.id) {
      throw new ConflictException(
        'El pedido no pertenece al cliente autenticado',
      );
    }

    if (pedido.estado !== 'PENDIENTE') {
      throw new ConflictException(
        'Solo se puede crear un pago para un pedido PENDIENTE',
      );
    }

    const pagoExistente = await this.prisma.pago.findUnique({
      where: {
        pedidoId,
      },
    });

    if (pagoExistente) {
      throw new ConflictException('El pedido ya tiene un pago registrado');
    }

    const secretKey = this.configService.get<string>('MOCKPAY_SECRET_KEY');

    const monto = Number(pedido.total);

    let response;

    try {
      response = await this.httpService.axiosRef.post(
        'https://mockpay-backend.onrender.com/api/v1/payments',
        {
          amount: monto,
          currency: 'USD',
          metadata: {
            order_id: `PED-${pedidoId}`,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch {
      throw new BadGatewayException(
        'No se pudo conectar con el proveedor de pagos',
      );
    }

    const pago = await this.prisma.pago.create({
      data: {
        pedidoId,
        transactionId: response.data.id_transaccion,
        estado: 'PENDIENTE',
        monto,
        moneda: 'USD',
        checkoutUrl: response.data.checkout_url,
      },
    });

    return pago;
  }

  async procesarWebhook(data: WebhookPagoDto) {
    const pago = await this.prisma.pago.findUnique({
      where: {
        transactionId: data.id,
      },
    });

    if (!pago) {
      throw new NotFoundException('El pago no existe');
    }

    if (!data.metadata || data.metadata.order_id !== `PED-${pago.pedidoId}`) {
      throw new ConflictException(
        'El pedido del webhook no coincide con el pago',
      );
    }

    if (data.amount !== Number(pago.monto)) {
      throw new ConflictException(
        'El monto del webhook no coincide con el pago',
      );
    }

    if (data.currency !== pago.moneda) {
      throw new ConflictException(
        'La moneda del webhook no coincide con el pago',
      );
    }

    if (
      (data.status === 'SUCCEEDED' && data.event !== 'payment.succeeded') ||
      (data.status === 'FAILED' && data.event !== 'payment.failed')
    ) {
      throw new ConflictException(
        'El evento y el estado del webhook no coinciden',
      );
    }

    if (pago.estado === 'SUCCEEDED' || pago.estado === 'FAILED') {
      return {
        mensaje: 'El webhook ya había sido procesado',
      };
    }

    const pedido = await this.prisma.pedido.findUnique({
      where: {
        id: pago.pedidoId,
      },
    });

    if (!pedido) {
      throw new NotFoundException('El pedido no existe');
    }

    if (pedido.estado === 'CANCELADO' && data.status === 'SUCCEEDED') {
      return {
        mensaje: 'El pedido ya estaba cancelado',
      };
    }

    if (data.status === 'SUCCEEDED') {
      await this.prisma.$transaction([
        this.prisma.pago.update({
          where: {
            id: pago.id,
          },
          data: {
            estado: 'SUCCEEDED',
          },
        }),

        this.prisma.pedido.update({
          where: {
            id: pago.pedidoId,
          },
          data: {
            estado: 'PAGADO',
          },
        }),
      ]);
    }

    if (data.status === 'FAILED') {
      await this.prisma.pago.update({
        where: {
          id: pago.id,
        },
        data: {
          estado: 'FAILED',
          failureReason: data.failure_reason,
        },
      });
    }

    return {
      mensaje: 'Webhook procesado correctamente',
    };
  }
}
