import { Queue } from "bullmq";

const metaDataQueue = new Queue("metadata");

interface VideoJob {
  id: string;
  originalUrl: string;
}

export const addToMetaDataQueue = async (
  video: VideoJob,
  userId: string,
  index: number
) => {

  await metaDataQueue.add("extractMetaData", {
    videoId: video.id,
    originalUrl: video.originalUrl,
    userId: userId,
    index
  });
};
