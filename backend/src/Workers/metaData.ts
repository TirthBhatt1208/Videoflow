import { Job, Worker } from "bullmq";
import IORedis from "ioredis";
import { extractMetaData } from "../Ffmpeg/metaData.js";
import { ApiError } from "../Utils/apiError.js";
import { ErrorMessage, ErrorStatus, SuccessMessage } from "../Enums/enums.js";
import { prisma } from "../db/index.js";
import { addToProccessFileQueue } from "../Queues/proccesFile.js";
import { publisher } from "./redisClient.js";
import { addToThumbnailsQueue } from "../Queues/thumbnails.js";

const connection = new IORedis({ maxRetriesPerRequest: null });

export const metaDataWorker = new Worker(
  "metadata",
  async (job: Job) => {
    const { originalUrl, videoId, userId , index } = job.data;

    if (!originalUrl || !videoId) {
      throw new ApiError(
        ErrorStatus.validationError,
        ErrorMessage.validationError_422,
      );
    }

    // await publisher.publish(
    //     "video-progress",
    //     JSON.stringify({
    //       userId: job.data.userId,
    //       progress: 5,
    //       status: "METADATA EXTRACTEING....",
    //       videoId: job.data.socketVideoId,
    //     }),
    //   );
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
        ErrorMessage.internalError_500,
      );
    }

    const dbJobLog = await prisma.jobLog.create({
      data: {
        videoId: job.data.videoId,
        jobType: "metadata",
        status: "success",
        message: SuccessMessage.metadataSuccess_200,
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

    await addToThumbnailsQueue({id: videoId , originalUrl } , userId , index);
  },
  {
    connection,
    concurrency: 1,
    lockDuration: 600000,
  },
);
