import { metaDataWorker } from "./metaData";
import { thumbnailsWorker } from "./thumbnails";
import dotenv from "dotenv";
dotenv.config();


metaDataWorker.on("completed", (job) => {
  console.log(`Metadata job ${job.id} completed`);
});

metaDataWorker.on("failed", (job, err) => {
  console.error(`Metadata job ${job?.id} failed`, err);
});

thumbnailsWorker.on("completed", (job) => {
  console.log(`Thumbnails job ${job.id} completed`);
});

thumbnailsWorker.on("failed", (job, err) => {
  console.error(`Thumbnails job ${job?.id} failed`, err);
});