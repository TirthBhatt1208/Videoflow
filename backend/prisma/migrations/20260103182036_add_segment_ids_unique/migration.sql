/*
  Warnings:

  - A unique constraint covering the columns `[proccesId]` on the table `Segment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Segment_proccesId_key" ON "Segment"("proccesId");
