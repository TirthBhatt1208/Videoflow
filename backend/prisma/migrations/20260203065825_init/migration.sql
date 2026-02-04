-- AlterEnum
ALTER TYPE "VideoStatus" ADD VALUE 'VTTGENERATED';

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "vttUrl" TEXT;
