/*
  Warnings:

  - You are about to drop the column `playlistUrl` on the `ProcessedFile` table. All the data in the column will be lost.
  - You are about to drop the column `proccesId` on the `Segment` table. All the data in the column will be lost.
  - You are about to drop the column `variant` on the `Segment` table. All the data in the column will be lost.
  - You are about to drop the column `master` on the `Video` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[videoId,variant]` on the table `ProcessedFile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `indexPlaylistUrl` to the `ProcessedFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variant` to the `ProcessedFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `processedFileId` to the `Segment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Segment" DROP CONSTRAINT "Segment_proccesId_fkey";

-- AlterTable
ALTER TABLE "ProcessedFile" DROP COLUMN "playlistUrl",
ADD COLUMN     "indexPlaylistUrl" TEXT NOT NULL,
ADD COLUMN     "variant" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Segment" DROP COLUMN "proccesId",
DROP COLUMN "variant",
ADD COLUMN     "processedFileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "master",
ADD COLUMN     "masterPlaylistUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ProcessedFile_videoId_variant_key" ON "ProcessedFile"("videoId", "variant");

-- CreateIndex
CREATE INDEX "Segment_processedFileId_idx" ON "Segment"("processedFileId");

-- AddForeignKey
ALTER TABLE "Segment" ADD CONSTRAINT "Segment_processedFileId_fkey" FOREIGN KEY ("processedFileId") REFERENCES "ProcessedFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
