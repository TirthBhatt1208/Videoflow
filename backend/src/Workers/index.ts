import { metaDataWorker } from "./metaData";
import { thumbnailsWorker } from "./thumbnails";
import {processFileWorker} from "./proccesFile"
import dotenv from "dotenv";
dotenv.config();


metaDataWorker.on("failed", (job, err) => {
  console.error(`Metadata job ${job?.id} failed`, err);
});

thumbnailsWorker.on("completed", (job) => {
  console.log(`Thumbnails job ${job.id} completed`);

});

thumbnailsWorker.on("failed", (job, err) => {
  console.error(`Procces file job ${job?.id} failed`, err);
});

processFileWorker.on("completed", (job) => {
  console.log(`Procces file job ${job.id} completed`);
});

processFileWorker.on("failed", (job, err) => {
  console.error(`Procces file job ${job?.id} failed`, err);
});