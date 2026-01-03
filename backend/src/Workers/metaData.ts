import { Job, Worker } from "bullmq";
import IORedis from "ioredis";
import { extractMetaData } from "../Ffmpeg/metaData.js";
import { ApiError } from "../Utils/apiError.js";
import { ErrorMessage, ErrorStatus, SuccessMessage } from "../Enums/enums.js";
import { prisma } from "../db/index.js";
import { addToProccessFileQueue } from "../Queues/proccesFile.js";

const connection = new IORedis({ maxRetriesPerRequest: null });

export const metaDataWorker = new Worker(
  "metadata",
  async (job: Job) => {
    const { originalUrl, videoId } = job.data;

    if (!originalUrl || !videoId) {
      throw new ApiError(
        ErrorStatus.validationError,
        ErrorMessage.validationError_422
      );
    }

    const metaData = await extractMetaData(originalUrl);

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

    const dbJobLog = await prisma.jobLog.create({
      data: {
        videoId: job.data.videoId,
        jobType: "metadata",
        status: "success",
        message: SuccessMessage.metadataSuccess_200
      },
    });

    if (!dbJobLog) {
    }

    await prisma.video.update({
      where: {
        id: videoId,
      },
      data: {
        status: "METADATA_EXTRACTED",
        progress: 10,
      },
    });

    await addToProccessFileQueue([{id:videoId , originalUrl}])
  },
  {
    connection,
    concurrency: 3,
  }
);