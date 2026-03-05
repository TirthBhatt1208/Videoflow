import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
  host: process.env.REDIS_HOST || "redis",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  maxRetriesPerRequest: null,
});

const vttFileQueue = new Queue("vttfile", { connection });

export const addToVttFileQueue = async (videoId: string) => {
  await vttFileQueue.add("createVttFile", { videoId });
};
