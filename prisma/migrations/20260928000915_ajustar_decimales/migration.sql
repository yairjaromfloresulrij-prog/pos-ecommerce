/*
  Warnings:

  - You are about to alter the column `precioCompra` on the `Producto` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `precioVenta` on the `Producto` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "Producto" ALTER COLUMN "precioCompra" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "precioVenta" SET DATA TYPE DECIMAL(10,2);
