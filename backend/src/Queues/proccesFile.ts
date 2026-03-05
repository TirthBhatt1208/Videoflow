import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
  host:process.env.REDIS_HOST || "redis",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  maxRetriesPerRequest: null,
});

const processFileQueue = new Queue("processfile", { connection });

interface VideoJob {
  id: string;
  originalUrl: string;
}
export const addToProccessFileQueue = async (
  video: VideoJob,
  userId: string,
  index: number
) => {
  await processFileQueue.add("proccesFiles", {
    videoId: video.id,
    originalUrl: video.originalUrl,
    userId: userId,
    index
  });
};
