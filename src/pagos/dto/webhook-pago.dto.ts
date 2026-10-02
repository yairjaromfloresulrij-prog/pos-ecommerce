import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class WebhookPagoDto {
  @ApiProperty({
    example: 'payment.succeeded',
    description: 'Evento enviado por MockPay',
    enum: ['payment.succeeded', 'payment.failed'],
  })
  @IsString()
  @IsIn(['payment.succeeded', 'payment.failed'])
  event: string;

  @ApiProperty({
    example: '4a915050-3255-4115-9ea4-6f5987945a95',
    description: 'ID de la transacción del pago',
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: 120.5,
    description: 'Monto del pago',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: 'USD',
    description: 'Moneda del pago',
  })
  @IsString()
  currency: string;

  @ApiProperty({
    example: 'SUCCEEDED',
    description: 'Estado final del pago',
    enum: ['SUCCEEDED', 'FAILED'],
  })
  @IsString()
  @IsIn(['SUCCEEDED', 'FAILED'])
  status: string;

  @ApiProperty({
    example: null,
    description: 'Motivo del fallo del pago',
    required: false,
  })
  @IsOptional()
  @IsString()
  failure_reason?: string;

  @ApiProperty({
    example: {
      order_id: 'PED-1',
    },
    description: 'Información del pedido asociado al pago',
  })
  @IsObject()
  metadata: {
    order_id: string;
  };
}
