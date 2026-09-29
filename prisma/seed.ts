import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
async function main() {
  const perifericos = await prisma.categoria.create({
    data: { nombre: 'Periféricos' },
  });
  const audio = await prisma.categoria.create({ data: { nombre: 'Audio' } });
  const cables = await prisma.categoria.create({
    data: { nombre: 'Cables y cargadores' },
  });
  const almacenamiento = await prisma.categoria.create({
    data: { nombre: 'Almacenamiento' },
  });
  const logitech = await prisma.marca.create({ data: { nombre: 'Logitech' } });
  const kingston = await prisma.marca.create({ data: { nombre: 'Kingston' } });
  const hyperx = await prisma.marca.create({ data: { nombre: 'HyperX' } });
  const mouse = await prisma.producto.create({
    data: {
      nombre: 'Mouse Gamer',
      descripcion: 'Mouse gamer con sensor óptico',
      precioCompra: 15000,
      precioVenta: 25000,
      categoriaId: perifericos.id,
      marcaId: logitech.id,
    },
  });
  await prisma.inventario.create({ data: { productoId: mouse.id, stock: 20 } });
  const teclado = await prisma.producto.create({
    data: {
      nombre: 'Teclado Mecánico',
      descripcion: 'Teclado mecánico para gaming',
      precioCompra: 30000,
      precioVenta: 45000,
      categoriaId: perifericos.id,
      marcaId: logitech.id,
    },
  });
  await prisma.inventario.create({
    data: { productoId: teclado.id, stock: 10 },
  });
  const auriculares = await prisma.producto.create({
    data: {
      nombre: 'Auriculares Gamer',
      descripcion: 'Auriculares gamer con micrófono',
      precioCompra: 25000,
      precioVenta: 40000,
      categoriaId: audio.id,
      marcaId: hyperx.id,
    },
  });
  await prisma.inventario.create({
    data: { productoId: auriculares.id, stock: 8 },
  });
  const ssd = await prisma.producto.create({
    data: {
      nombre: 'SSD 1TB',
      descripcion: 'Unidad de almacenamiento SSD de 1TB',
      precioCompra: 70000,
      precioVenta: 95000,
      categoriaId: almacenamiento.id,
      marcaId: kingston.id,
    },
  });
  await prisma.inventario.create({ data: { productoId: ssd.id, stock: 5 } });
  const passwordAdmin = await bcrypt.hash('admin123', 10);
  const passwordCajero = await bcrypt.hash('cajero123', 10);
  const passwordCliente = await bcrypt.hash('cliente123', 10);
  await prisma.usuario.create({
    data: { email: 'admin@tienda.com', password: passwordAdmin, rol: 'ADMIN' },
  });
  const cajero = await prisma.usuario.create({
    data: {
      email: 'cajero@tienda.com',
      password: passwordCajero,
      rol: 'CAJERO',
    },
  });
  const cliente = await prisma.usuario.create({
    data: {
      email: 'cliente@tienda.com',
      password: passwordCliente,
      rol: 'CLIENTE',
    },
  });

  const caja = await prisma.caja.create({
    data: {
      cajeroId: cajero.id,
      fechaApertura: new Date(),
      montoInicial: 50000,
    },
  });
  const clienteWeb = await prisma.clienteWeb.create({
    data: {
      usuarioId: cliente.id,
      nombre: 'Juan',
      apellido: 'Pérez',
      telefono: '1122334455',
    },
  });
  const direccion = await prisma.direccion.create({
    data: {
      clienteId: clienteWeb.id,
      calle: 'Av. Siempre Viva',
      numero: '742',
      ciudad: 'Buenos Aires',
      referencia: 'Casa con puerta blanca',
    },
  });

  const carrito = await prisma.carrito.create({
    data: {
      clienteId: clienteWeb.id,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
  });

  await prisma.detalleCarrito.create({
    data: {
      carritoId: carrito.id,
      productoId: mouse.id,
      cantidad: 2,
    },
  });

  await prisma.detalleCarrito.create({
    data: {
      carritoId: carrito.id,
      productoId: auriculares.id,
      cantidad: 1,
    },
  });

  const pedido = await prisma.pedido.create({
    data: {
      clienteId: clienteWeb.id,
      direccionId: direccion.id,
      fecha: new Date(),
      estado: 'PENDIENTE',
      total: 90000,
    },
  });

  await prisma.detallePedido.create({
    data: {
      pedidoId: pedido.id,
      productoId: mouse.id,
      cantidad: 2,
      precioUnitario: mouse.precioVenta,
    },
  });

  await prisma.detallePedido.create({
    data: {
      pedidoId: pedido.id,
      productoId: auriculares.id,
      cantidad: 1,
      precioUnitario: auriculares.precioVenta,
    },
  });

  const venta = await prisma.venta.create({
    data: {
      fecha: new Date(),
      total: 70000,
      metodoPago: 'EFECTIVO',
      cajaId: caja.id,
    },
  });

  await prisma.detalleVenta.create({
    data: {
      ventaId: venta.id,
      productoId: teclado.id,
      cantidad: 1,
      precioUnitario: teclado.precioVenta,
    },
  });

  await prisma.detalleVenta.create({
    data: {
      ventaId: venta.id,
      productoId: mouse.id,
      cantidad: 1,
      precioUnitario: mouse.precioVenta,
    },
  });
}
main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
