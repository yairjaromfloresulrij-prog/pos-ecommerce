<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

  <p align="center">API REST para un sistema de <strong>Punto de Venta (POS)</strong> y <strong>E-commerce</strong>, construida con <a href="http://nodejs.org" target="_blank">Node.js</a> y <a href="https://nestjs.com" target="_blank">NestJS</a>.</p>

## Description

**POS & E-commerce API** es un backend construido sobre el framework [Nest](https://github.com/nestjs/nest) (TypeScript) que unifica en una sola API dos canales de venta de una misma tienda:

- **Punto de venta (POS):** los cajeros abren una caja, registran ventas en mostrador y cierran la caja con conciliación de efectivo.
- **Tienda online:** los clientes se registran, arman su carrito, generan pedidos con una dirección de envío y pagan a través de una pasarela de pagos (MockPay).
- **Administración y logística:** los administradores gestionan el catálogo, el stock, los usuarios internos y el estado de los pedidos.

### Stack

| Tecnología                                               | Uso                                   |
| -------------------------------------------------------- | ------------------------------------- |
| [NestJS 12](https://nestjs.com)                          | Framework principal                   |
| [Prisma 7](https://www.prisma.io) + `@prisma/adapter-pg` | ORM y migraciones                     |
| PostgreSQL                                               | Base de datos                         |
| Passport + JWT (`@nestjs/jwt`)                           | Autenticación                         |
| bcrypt                                                   | Hash de contraseñas                   |
| class-validator / class-transformer                      | Validación de DTOs                    |
| `@nestjs/swagger`                                        | Documentación interactiva de la API   |
| `@nestjs/axios`                                          | Comunicación con la pasarela de pagos |
| Vitest + Supertest                                       | Tests unitarios y e2e                 |
| oxlint + Prettier                                        | Lint y formato                        |
| pnpm                                                     | Gestor de paquetes                    |

## Project setup

```bash
$ pnpm install
```

### Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```bash
# Cadena de conexión a PostgreSQL
DATABASE_URL="postgresql://usuario:password@localhost:5432/pos_ecommerce"

# Puerto de la API (opcional, por defecto 3000)
PORT=3000

# Secreto para firmar los tokens JWT
JWT_SECRET="un-secreto-largo-y-aleatorio"

# Clave secreta del proveedor de pagos MockPay
MOCKPAY_SECRET_KEY="tu-clave-de-mockpay"
```

> ⚠️ No subas tu archivo `.env` al repositorio.

### Base de datos

El esquema se define en `prisma/schema.prisma` y la configuración de Prisma está en `prisma7.config.ts`, por eso los comandos de Prisma reciben el flag `--config`.

```bash
# aplicar las migraciones
$ pnpm prisma migrate deploy --config prisma7.config.ts

# (desarrollo) crear y aplicar una nueva migración
$ pnpm prisma migrate dev --config prisma7.config.ts

# generar el cliente de Prisma (se genera en src/generated/prisma)
$ pnpm prisma generate --config prisma7.config.ts

# cargar datos de ejemplo (categorías, marcas, productos, usuarios, etc.)
$ pnpm prisma db seed --config prisma7.config.ts
```

#### Usuarios del seed

| Rol     | Email                | Contraseña   |
| ------- | -------------------- | ------------ |
| ADMIN   | `admin@tienda.com`   | `admin123`   |
| CAJERO  | `cajero@tienda.com`  | `cajero123`  |
| CLIENTE | `cliente@tienda.com` | `cliente123` |

> Son credenciales de desarrollo. Cámbialas o no ejecutes el seed en producción.

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run build
$ pnpm run start:prod
```

Una vez levantado el servidor:

- API: `http://localhost:3000`
- Documentación Swagger: `http://localhost:3000/api/docs`

Para probar los endpoints protegidos desde Swagger, inicia sesión en `POST /auth/login`, copia el `access_token` y pégalo en el botón **Authorize**.

## API

### Roles

| Rol       | Descripción                                                                     |
| --------- | ------------------------------------------------------------------------------- |
| `ADMIN`   | Gestiona catálogo, stock, usuarios internos, pedidos y consulta cajas y ventas. |
| `CAJERO`  | Abre y cierra su caja y registra ventas en el punto de venta.                   |
| `CLIENTE` | Usa la tienda online: carrito, pedidos y pagos.                                 |

### Endpoints

| Módulo          | Método | Ruta                   | Acceso        | Descripción                                         |
| --------------- | ------ | ---------------------- | ------------- | --------------------------------------------------- |
| **Auth**        | POST   | `/auth/register`       | Público       | Registrar un nuevo cliente                          |
|                 | POST   | `/auth/login`          | Público       | Iniciar sesión y obtener el JWT                     |
|                 | POST   | `/auth/users`          | ADMIN         | Crear un usuario interno                            |
|                 | GET    | `/auth/profile`        | ADMIN         | Perfil del usuario autenticado                      |
| **Productos**   | GET    | `/productos`           | Público       | Listar productos activos (filtro por `categoriaId`) |
|                 | GET    | `/productos/:id`       | Público       | Consultar un producto                               |
|                 | POST   | `/productos`           | ADMIN         | Crear un producto                                   |
|                 | PATCH  | `/productos/:id`       | ADMIN         | Actualizar un producto                              |
|                 | PATCH  | `/productos/:id/stock` | ADMIN         | Actualizar el stock                                 |
|                 | DELETE | `/productos/:id`       | ADMIN         | Baja lógica (`activo = false`)                      |
| **Cajas**       | POST   | `/cajas`               | CAJERO        | Abrir una caja                                      |
|                 | GET    | `/cajas/abierta`       | CAJERO        | Consultar la caja abierta del cajero                |
|                 | PATCH  | `/cajas/:id/cerrar`    | CAJERO        | Cerrar la caja y conciliar el efectivo              |
|                 | GET    | `/cajas`               | ADMIN         | Listar todas las cajas con sus ventas               |
| **Ventas**      | POST   | `/ventas`              | CAJERO        | Registrar una venta en la caja abierta              |
|                 | GET    | `/ventas`              | ADMIN, CAJERO | Listar ventas (filtro opcional `fecha`)             |
|                 | GET    | `/ventas/:id`          | ADMIN, CAJERO | Consultar una venta                                 |
| **Direcciones** | POST   | `/direcciones`         | —             | Crear una dirección para un cliente                 |
| **Carritos**    | POST   | `/carritos`            | CLIENTE       | Agregar un producto al carrito                      |
|                 | GET    | `/carritos`            | CLIENTE       | Consultar el carrito                                |
| **Pedidos**     | POST   | `/pedidos`             | CLIENTE       | Crear un pedido a partir del carrito                |
|                 | GET    | `/pedidos`             | ADMIN         | Listar todos los pedidos                            |
|                 | GET    | `/pedidos/logistica`   | ADMIN         | Cola de pedidos pendientes, pagados y en tránsito   |
|                 | PATCH  | `/pedidos/:id/estado`  | ADMIN         | Cambiar el estado de un pedido                      |
| **Pagos**       | POST   | `/pagos/crear`         | CLIENTE       | Iniciar un pago para un pedido                      |
|                 | POST   | `/pagos/webhook`       | Proveedor     | Recibe las notificaciones de MockPay                |

La documentación detallada de cada endpoint (cuerpos, respuestas y códigos de error) está disponible en Swagger: `/api/docs`.

### Flujos principales

**Venta en mostrador (POS)**

1. El cajero inicia sesión y abre una caja con un monto inicial (`POST /cajas`).
2. Registra ventas indicando los productos y el método de pago: `EFECTIVO`, `TARJETA`, `TRANSFERENCIA` o `QR` (`POST /ventas`). Cada venta descuenta el stock.
3. Al terminar el turno cierra la caja con el efectivo contado (`PATCH /cajas/:id/cerrar`). La API compara el efectivo reportado contra el esperado (monto inicial + ventas en efectivo) y devuelve la diferencia.

**Compra online (E-commerce)**

1. El cliente se registra e inicia sesión, crea una dirección y agrega productos al carrito.
2. Genera el pedido (`POST /pedidos`): se valida el stock, se calcula el total, se descuenta el inventario y se vacía el carrito.
3. Inicia el pago (`POST /pagos/crear`): se crea la transacción en MockPay y se devuelve una `checkoutUrl`.
4. MockPay notifica el resultado a `POST /pagos/webhook`. Si el pago fue exitoso, el pedido pasa a `PAGADO`.
5. El administrador hace avanzar el pedido hasta su entrega.

**Estados de un pedido**

```
PENDIENTE ──► PAGADO ──► EN_TRANSITO ──► ENTREGADO
    │            │
    └────────────┴──► CANCELADO   (devuelve el stock al inventario)
```

`ENTREGADO` y `CANCELADO` son estados finales.

## Project structure

```
├── prisma/
│   ├── migrations/          # Migraciones de la base de datos
│   ├── schema.prisma        # Modelos y enums
│   └── seed.ts              # Datos de ejemplo
├── src/
│   ├── auth/                # Registro, login, JWT, guards y roles
│   ├── productos/           # Catálogo e inventario
│   ├── cajas/               # Apertura y cierre de caja
│   ├── ventas/              # Ventas de mostrador
│   ├── carritos/            # Carrito de compras
│   ├── direcciones/         # Direcciones de envío
│   ├── pedidos/             # Pedidos y logística
│   ├── pagos/               # Integración con MockPay y webhook
│   ├── prisma/              # PrismaService / PrismaModule
│   ├── generated/prisma/    # Cliente de Prisma generado
│   ├── app.module.ts
│   └── main.ts
└── test/                    # Tests e2e
```

### Modelo de datos

`Categoria`, `Marca`, `Producto` e `Inventario` forman el catálogo. `Usuario` (con rol `ADMIN`, `CAJERO` o `CLIENTE`) se relaciona con `ClienteWeb`, que a su vez tiene `Direccion`, `Carrito` (con `DetalleCarrito`) y `Pedido` (con `DetallePedido` y `Pago`). Del lado del POS, `Caja` agrupa las `Venta` (con `DetalleVenta`) de un cajero.

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

Otros scripts útiles:

```bash
# lint
$ pnpm run lint

# formato
$ pnpm run format
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

Antes de desplegar este proyecto asegúrate de:

1. Definir todas las variables de entorno (`DATABASE_URL`, `JWT_SECRET`, `MOCKPAY_SECRET_KEY`, `PORT`) en el entorno de producción.
2. Ejecutar las migraciones con `pnpm prisma migrate deploy --config prisma7.config.ts`.
3. Compilar con `pnpm run build` y arrancar con `pnpm run start:prod`.
4. Configurar en MockPay la URL pública del webhook: `https://<tu-dominio>/pagos/webhook`.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- [Documentación de Prisma](https://www.prisma.io/docs) para el ORM y las migraciones.
- For questions and support, please visit the [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out the official video [courses](https://courses.nestjs.com/).
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).

## License

Proyecto privado (`UNLICENSED`).
