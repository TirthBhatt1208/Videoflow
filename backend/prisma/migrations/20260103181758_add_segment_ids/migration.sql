/*
  Warnings:

  - You are about to drop the column `baseUrl` on the `ProcessedFile` table. All the data in the column will be lost.
  - Added the required column `proccesId` to the `Segment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProcessedFile" DROP COLUMN "baseUrl";

-- AlterTable
ALTER TABLE "Segment" ADD COLUMN     "proccesId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Segment" ADD CONSTRAINT "Segment_proccesId_fkey" FOREIGN KEY ("proccesId") REFERENCES "ProcessedFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
