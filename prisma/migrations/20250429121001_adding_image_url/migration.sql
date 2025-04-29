-- AlterTable
ALTER TABLE "Messages" ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'text';
