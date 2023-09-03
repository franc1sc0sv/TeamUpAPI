/*
  Warnings:

  - You are about to drop the column `token` on the `Usuarios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Usuarios" DROP COLUMN "token",
ADD COLUMN     "tokenEmail" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "tokenVerificar" TEXT NOT NULL DEFAULT '';
