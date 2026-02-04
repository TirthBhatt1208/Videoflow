import { Job, Worker } from "bullmq";
import IORedis from "ioredis";
import { ApiError } from "../Utils/apiError";
import { ErrorMessage, ErrorStatus } from "../Enums/enums";
import { prisma } from "../db";
import path from "node:path";
import fs from "fs";
import { glob } from "glob";
import { uploadOnCloudinary } from "../Utils/cloudinary";

const connection = new IORedis({ maxRetriesPerRequest: null });

function secondsToTimestamp(sec: number) {
  const hrs = Math.floor(sec / 3600)
    .toString()
    .padStart(2, "0");
  const mins = Math.floor((sec % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${hrs}:${mins}:${secs}.000`;
}

export const vttFileWorker = new Worker(
  "vttfile",
  async (job: Job) => {
    try {
      const { videoId } = job.data;

      if (!videoId) {
        throw new ApiError(ErrorStatus.notFound, ErrorMessage.notFound_404);
      }

      const videos = await prisma.thumbnail.findMany({
        where: {
          videoId,
        },
      });

      if (!videos) {
        throw new ApiError(
          ErrorStatus.internalError,
          ErrorMessage.internalError_500,
        );
      }

      let vtt = "WEBVTT\n\n";

      for (let i = 0; i < videos.length; i++) {
        const start = videos[i]?.time;
        const end = start! + 2; // <-- IMPORTANT

        vtt += `${secondsToTimestamp(start!)} --> ${secondsToTimestamp(end)}\n`;
        vtt += `${videos[i]?.url}\n\n`;
      }

      const outputPath = path.join(
        process.cwd(),
        "public",
        "thumbnails",
        videoId,
      );
      fs.mkdirSync(outputPath, { recursive: true });
      fs.writeFileSync(`${outputPath}/thumbnailWebVtt.vtt`, vtt);

      const response = await uploadOnCloudinary(
        `${outputPath}/thumbnailWebVtt.vtt`,
        "raw",
      );
      console.log("\n\nIN THE VTT WORKER Response; \n\n", response);
      const updatedVideos = await prisma.video.update({
        where: {
          id: videoId,
        },
        data: {
          vttUrl: response?.url!,
        },
      });
      console.log(
        "\n\nIN THE VTT WORKER UPDATED VIDEOS: ; \n\n",
        updatedVideos,
      );
      console.log("Every thing wroks fine!!!");
    } catch (error) {}
  },
  { connection, concurrency: 1 },
);
