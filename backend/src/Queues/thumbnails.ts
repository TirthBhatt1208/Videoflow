import { Queue } from "bullmq";

const thumbnailsQueue = new Queue("thumbnails");

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
