/*
  Warnings:

  - The values [TRANSCODING] on the enum `VideoStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `time` to the `Thumbnail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VideoStatus_new" AS ENUM ('UPLOADED', 'QUEUED', 'METADATA_EXTRACTED', 'TRANSCODIND', 'HLS_READY', 'COMPLETED', 'FAILED');
ALTER TABLE "public"."Video" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Video" ALTER COLUMN "status" TYPE "VideoStatus_new" USING ("status"::text::"VideoStatus_new");
ALTER TYPE "VideoStatus" RENAME TO "VideoStatus_old";
ALTER TYPE "VideoStatus_new" RENAME TO "VideoStatus";
DROP TYPE "public"."VideoStatus_old";
ALTER TABLE "Video" ALTER COLUMN "status" SET DEFAULT 'UPLOADED';
COMMIT;

-- DropIndex
DROP INDEX "Thumbnail_videoId_key";

-- AlterTable
ALTER TABLE "Thumbnail" ADD COLUMN     "time" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Thumbnail_videoId_idx" ON "Thumbnail"("videoId");
