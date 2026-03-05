import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
  host: process.env.REDIS_HOST || "redis",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  maxRetriesPerRequest: null,
});

const thumbnailsQueue = new Queue("thumbnails", { connection });

interface VideoJob {
  id: string;
  originalUrl: string;
}

export const addToThumbnailsQueue = async (
  video: VideoJob,
  userId: string,
  index: number
) => {
  await thumbnailsQueue.add("MakeThumbnails", {
    videoId: video.id,
    originalUrl: video.originalUrl,
    userId: userId,
    index
  });

};
