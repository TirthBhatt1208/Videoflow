import { Queue } from "bullmq";

const processFileQueue = new Queue("processfile");

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
