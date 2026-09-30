import {
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DetalleVentaDto } from './detalle-venta.dto.js';
import { MetodoPago } from '../../generated/prisma/client.js';

export class CreateVentaDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => DetalleVentaDto)
  productos: DetalleVentaDto[];

  @IsEnum(MetodoPago)
  metodoPago: MetodoPago;
}
