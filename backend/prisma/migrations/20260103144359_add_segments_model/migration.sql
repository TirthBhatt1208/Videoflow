-- CreateTable
CREATE TABLE "Segment" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "variant" TEXT NOT NULL,
    "segmentIndex" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "duration" DOUBLE PRECISION,
    "size" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Segment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Segment_videoId_idx" ON "Segment"("videoId");

-- CreateIndex
CREATE INDEX "Segment_videoId_variant_idx" ON "Segment"("videoId", "variant");

-- AddForeignKey
ALTER TABLE "Segment" ADD CONSTRAINT "Segment_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
