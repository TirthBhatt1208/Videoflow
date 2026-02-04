import { metaDataWorker } from "./metaData";
import { thumbnailsWorker } from "./thumbnails";
import {processFileWorker} from "./proccesFile"
import {vttFileWorker} from "./vttFile"
import dotenv from "dotenv";
import { publisher } from "./redisClient";
dotenv.config();

metaDataWorker.on("completed", async(job, err) => {
  console.error(
    `Metadata job ${job.id} completed with index: ${job.data.index}`,
    err,
  );
  await publisher.publish(
    "video-progress",
    JSON.stringify({
      userId: job.data.userId,
      progress: 40,
      status: "METADATA EXTRACTED",
      videoId: job.data.index,
    }),
  );
  console.log("Published progress update to Redis from metadata worker");
});
metaDataWorker.on("failed", (job, err) => {
  console.error(`Metadata job ${job?.id} failed`, err);
});

thumbnailsWorker.on("completed", async (job) => {
  console.log(
    `Thumbnails job ${job.id} completed with index: ${job.data.index}`,
  );
   await publisher.publish(
     "video-progress",
     JSON.stringify({
       userId: job.data.userId,
       progress: 75,
       status: "THUMBNAILS GENERATED",
       videoId: job.data.index,
     }),
   );
  console.log("Published progress update to Redis from thumbnail worker");
});

thumbnailsWorker.on("failed", (job, err) => {
  console.error(`Procces file job ${job?.id} failed`, err);
});

processFileWorker.on("completed", async (job) => {
  console.log(
    `Procces file job ${job.id} completed with index: ${job.data.index}`,
  );

  await publisher.publish(
    "video-progress",
    JSON.stringify({
      userId: job.data.userId,
      progress: 100,
      status: "COMPLETED",
      videoId: job.data.index,
    }),
  );
  console.log("Published progress update to Redis from procces file worker");
});

processFileWorker.on("failed", (job, err) => {
  console.error(`Procces file job ${job?.id} failed`, err);
});