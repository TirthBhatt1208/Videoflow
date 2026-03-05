import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
  host:process.env.REDIS_HOST || "redis",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  maxRetriesPerRequest: null,
});
const metaDataQueue = new Queue("metadata", { connection });

interface VideoJob {
  id: string;
  originalUrl: string;
}


export const addToMetaDataQueue = async (
  video: VideoJob,
  userId: string,
  index: number
) => {
  console.log("metadata config check:", {
    cloud_name: !!process.env.REDIS_HOST,
    api_key: !!process.env.REDIS_PORT,
  });
  await metaDataQueue.add("extractMetaData", {
    videoId: video.id,
    originalUrl: video.originalUrl,
    userId: userId,
    index
  });
};
