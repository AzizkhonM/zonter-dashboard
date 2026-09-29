-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('UZ', 'EN', 'RU');

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "locale" "Locale" NOT NULL DEFAULT 'UZ';

-- AlterTable
ALTER TABLE "OrganizationRequest" ADD COLUMN     "locale" "Locale" NOT NULL DEFAULT 'UZ';
