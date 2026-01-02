import { Queue } from "bullmq";

const thumbnailsQueue = new Queue("thumbnails");

interface VideoJob {
  id: string;
  originalUrl: string;
}

export const addToThumbnailsQueue = async (videos : VideoJob[]) => {
    for (const video of videos) {
        await thumbnailsQueue.add("MakeThumbnails", {
            videoId: video.id,
            originalUrl: video.originalUrl,
        });
    }
}