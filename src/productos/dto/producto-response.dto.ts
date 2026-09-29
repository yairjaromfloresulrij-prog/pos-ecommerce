export class ProductoResponseDto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoriaId: number;
  marcaId: number;
  inventario: {
    stock: number;
  } | null;
}
