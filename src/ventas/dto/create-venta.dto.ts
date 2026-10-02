import {
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DetalleVentaDto } from './detalle-venta.dto.js';
import { MetodoPago } from '../../generated/prisma/client.js';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVentaDto {
  @ApiProperty({
    example: [
      {
        productoId: 1,
        cantidad: 2,
      },
      {
        productoId: 2,
        cantidad: 1,
      },
    ],
    description: 'Lista de productos que forman parte de la venta',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => DetalleVentaDto)
  productos: DetalleVentaDto[];

  @ApiProperty({
    example: 'EFECTIVO',
    enum: MetodoPago,
    description: 'Método de pago utilizado para realizar la venta',
  })
  @IsEnum(MetodoPago)
  metodoPago: MetodoPago;
}
