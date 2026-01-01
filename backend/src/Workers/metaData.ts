import { Job, Worker } from "bullmq";
import IORedis from "ioredis";
import { extractMetaData } from "../Ffmpeg/metaData.js";
import { ApiError } from "../Utils/apiError.js";
import { ErrorMessage, ErrorStatus, SuccessMessage } from "../Enums/enums.js";
import { prisma } from "../db/index.js";

const connection = new IORedis({ maxRetriesPerRequest: null });

const metaDataWorker = new Worker(
  "metadata",
  async (job: Job) => {
    const { originalUrl, videoId } = job.data;
    console.log(`originalUrl: ${originalUrl}, videoId: ${videoId}`);

    if (!originalUrl || !videoId) {
      throw new ApiError(
        ErrorStatus.validationError,
        ErrorMessage.validationError_422
      );
    }

    console.log("Starting metadata extraction...");
    const metaData = await extractMetaData(originalUrl);
    console.log("Metadata extracted:", metaData);

    const { duration, width, height, fps, codec, audioCodec, bitrate } =
      metaData;

    const dbMetaData = await prisma.metadata.create({
      data: {
        videoId,
        duration,
        width,
        height,
        fps,
        codec,
        audioCodec,
        bitrate,
      },
    });

    if (!dbMetaData) {
      throw new ApiError(
        ErrorStatus.internalError,
        ErrorMessage.internalError_500
      );
    }
    console.log("Metadata stored in database:", dbMetaData);

    const dbJobLog = await prisma.jobLog.create({
      data: {
        videoId: job.data.videoId,
        jobType: "metadata",
        status: "success",
        message: SuccessMessage.metadataSuccess_200
      },
    });

    if (!dbJobLog) {
      console.error("stroring job on db has been failed!!!");
    }

    console.log("Job log stored in database:", dbJobLog);

    await prisma.video.update({
      where: {
        id: videoId,
      },
      data: {
        status: "METADATA_EXTRACTED",
        progress: 10,
      },
    });
  },
  {
    connection,
    concurrency: 3,
  }
);

metaDataWorker.on("completed", (job) => {
  console.log(`Metadata job ${job.id} completed`);
});

metaDataWorker.on("failed", (job, err) => {
  console.error(`Metadata job ${job?.id} failed`, err);
});
