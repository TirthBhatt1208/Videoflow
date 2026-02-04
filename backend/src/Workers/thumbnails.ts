import { Job, Worker } from "bullmq";
import IORedis from "ioredis";
import { ApiError } from "../Utils/apiError.js";
import { ErrorMessage, ErrorStatus, SuccessMessage } from "../Enums/enums.js";
import { generateThumbnails } from "../Ffmpeg/thumbnails.js";
import path from "node:path";
import fs from "fs";
import { uploadOnCloudinary } from "../Utils/cloudinary.js";
import { prisma } from "../db/index.js";
import { publisher } from "./redisClient.js";
import { addToProccessFileQueue } from "../Queues/proccesFile.js";
import { addToVttFileQueue } from "../Queues/vttFile.js";

const connection = new IORedis({ maxRetriesPerRequest: null });

type thumbnails = {
  videoId: string;
  time: number;
  url: string;
};

export const thumbnailsWorker = new Worker(
  "thumbnails",
  async (job: Job) => {
    const { videoId, originalUrl , userId , index } = job.data;

    if (!videoId || !originalUrl) {
      throw new ApiError(
        ErrorStatus.validationError,
        ErrorMessage.validationError_422,
      );
    }

    const outputPath = path.join(
      process.cwd(),
      "public",
      "thumbnails",
      videoId,
    );
    fs.mkdirSync(outputPath, { recursive: true });

    // await publisher.publish(
    //   "video-progress",
    //   JSON.stringify({
    //     userId: job.data.userId,
    //     progress: 30,
    //     status: "THUMBNAILS GENERATING...",
    //     videoId: job.data.socketVideoId,
    //   }),
    // );
    await generateThumbnails(originalUrl, outputPath);

    const files = await fs
      .readdirSync(outputPath)
      .filter((f) => {
        return f.endsWith(".png");
      })
      .sort();

    const interval = 2;
    const thumbnails: thumbnails[] = [];

    for (let i = 0; i < files.length; i++) {
      const fileName = files[i];
      let fullPath = path.join(outputPath, fileName!);
      fullPath = fullPath.replace(/\\/g, "/");
      const upload = await uploadOnCloudinary(fullPath, "image");
      if (!upload) {
        throw new ApiError(
          ErrorStatus.uploadFailedOnCloud,
          ErrorMessage.uploadFailedOnCloud_500,
        );
      }

      //fs.unlinkSync(fullPath);

      const time = i * interval;

      thumbnails.push({
        videoId,
        url: upload.url,
        time,
      });
    }

    fs.rmSync(path.join(process.cwd(), "public", "thumbnails"), {
      recursive: true,
      force: true,
    });

    const dbThumbnails = await prisma.thumbnail.createMany({
      data: thumbnails,
    });

    if (!dbThumbnails) {
      throw new ApiError(
        ErrorStatus.transcodingFailed,
        ErrorMessage.transcodingFailed_500,
      );
    }

    try {
      await prisma.jobLog.create({
        data: {
          videoId: videoId,
          jobType: "transcode",
          status: "success",
          message: SuccessMessage.transcodingSuccess_200,
        },
      });
    } catch (error) {
      console.error(`Erorr in job log transcodig... error: ${error}`);
    }

    try {
      await prisma.video.update({
        where: {
          id: videoId,
        },
        data: {
          status: "TRANSCODED",
          progress: 25,
        },
      });
    } catch (error) {
      console.error(`Erorr to update trnascoding status in db.... ${error}`);
    }

    await addToProccessFileQueue({ id: videoId, originalUrl }, userId, index);
    await addToVttFileQueue(videoId)
  },
  { connection, concurrency: 1, lockDuration: 600000 },
);
