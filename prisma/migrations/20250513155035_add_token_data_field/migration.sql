-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "data" JSONB,
ALTER COLUMN "weight" DROP NOT NULL;
