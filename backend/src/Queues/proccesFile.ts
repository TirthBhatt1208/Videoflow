import {Queue} from "bullmq"

const processFileQueue = new Queue("processfile")

interface VideoJob {
  id: string;
  originalUrl: string;
}
export const addToProccessFileQueue = async (videos: VideoJob[]) => {
    for(const video of videos){
        await processFileQueue.add("proccesFiles" , {videoId: video.id , originalUrl: video.originalUrl})
    }
}