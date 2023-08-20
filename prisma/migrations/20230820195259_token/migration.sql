-- AlterTable
ALTER TABLE `equipos` ALTER COLUMN `invitaciones_token` DROP DEFAULT,
    ALTER COLUMN `password_token` DROP DEFAULT;

-- AlterTable
ALTER TABLE `usuarios` ALTER COLUMN `token` DROP DEFAULT;
