import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ProductosModule } from './productos/productos.module.js';
import { VentasModule } from './ventas/ventas.module.js';
import { CarritosModule } from './carritos/carritos.module.js';
import { PedidosModule } from './pedidos/pedidos.module.js';
import { CajasModule } from './cajas/cajas.module.js';
import { PagosModule } from './pagos/pagos.module.js';
import { DireccionesModule } from './direcciones/direcciones.module.js';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductosModule,
    VentasModule,
    CarritosModule,
    PedidosModule,
    CajasModule,
    PagosModule,
    DireccionesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
