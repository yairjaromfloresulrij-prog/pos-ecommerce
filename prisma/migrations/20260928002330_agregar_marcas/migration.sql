/*
  Warnings:

  - You are about to drop the column `actulizadoEn` on the `Carrito` table. All the data in the column will be lost.
  - Added the required column `actualizadoEn` to the `Carrito` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marcaId` to the `Producto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DetalleCarrito" DROP CONSTRAINT "DetalleCarrito_carritoId_fkey";

-- AlterTable
ALTER TABLE "Carrito" DROP COLUMN "actulizadoEn",
ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "marcaId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Marca" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Marca_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Marca_nombre_key" ON "Marca"("nombre");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "Marca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleCarrito" ADD CONSTRAINT "DetalleCarrito_carritoId_fkey" FOREIGN KEY ("carritoId") REFERENCES "Carrito"("id") ON DELETE CASCADE ON UPDATE CASCADE;
