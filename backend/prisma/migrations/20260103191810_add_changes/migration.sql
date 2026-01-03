/*
  Warnings:

  - You are about to drop the column `videoId` on the `Segment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Segment" DROP CONSTRAINT "Segment_videoId_fkey";

-- DropIndex
DROP INDEX "Segment_proccesId_key";

-- DropIndex
DROP INDEX "Segment_videoId_idx";

-- DropIndex
DROP INDEX "Segment_videoId_variant_idx";

-- AlterTable
ALTER TABLE "Segment" DROP COLUMN "videoId";
