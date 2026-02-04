import { Queue } from "bullmq";

const vttFileQueue = new Queue("vttfile");

export const addToVttFileQueue = async (videoId: string) => {
  await vttFileQueue.add("createVttFile", { videoId });
};
