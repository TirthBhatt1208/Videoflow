import { Queue } from "bullmq";

const metaDataQueue = new Queue("metadata");

interface VideoJob {
  id: string;
  originalUrl: string;
}

export const addToMetaDataQueue = async (videos: VideoJob[]) => {
  for (const video of videos) {
    await metaDataQueue.add("extractMetaData", {
      videoId: video.id,
      originalUrl: video.originalUrl,
    });
  }
};
