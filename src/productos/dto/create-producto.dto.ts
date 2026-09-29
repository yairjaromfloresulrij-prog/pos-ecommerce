import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  IsPositive,
  IsInt,
} from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  nombre: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(500)
  descripcion: string;
  @IsNumber()
  @IsPositive()
  precioCompra: number;
  @IsNumber()
  @IsPositive()
  precioVenta: number;
  @IsInt()
  @IsPositive()
  categoriaId: number;
  @IsInt()
  @IsPositive()
  marcaId: number;
}
