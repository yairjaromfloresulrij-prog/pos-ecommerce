/*
  Warnings:

  - You are about to alter the column `montoInicial` on the `Caja` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `montoFinal` on the `Caja` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `precioUnitario` on the `DetallePedido` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `precioUnitario` on the `DetalleVenta` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `total` on the `Pedido` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `total` on the `Venta` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "Caja" ALTER COLUMN "montoInicial" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "montoFinal" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "DetallePedido" ALTER COLUMN "precioUnitario" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "DetalleVenta" ALTER COLUMN "precioUnitario" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Pedido" ALTER COLUMN "total" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Venta" ALTER COLUMN "total" SET DATA TYPE DECIMAL(10,2);
