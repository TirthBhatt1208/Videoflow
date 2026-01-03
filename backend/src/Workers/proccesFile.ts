import { Job, Worker } from "bullmq";
import IORedis from "ioredis";
import path from "node:path";
import fs from "fs";
import { glob } from "glob";

import { prisma } from "../db";
import { generateProccesFiles } from "../Ffmpeg/proccesFile";
import { uploadOnCloudinary } from "../Utils/cloudinary";
import { ApiError } from "../Utils/apiError";
import { ErrorMessage, ErrorStatus } from "../Enums/enums";

const connection = new IORedis({ maxRetriesPerRequest: null });


async function getFiles(outputDir: string): Promise<string[]> {
  const patterns = [
    `${outputDir}/*.m3u8`,
    `${outputDir}/v*/index.m3u8`,
    `${outputDir}/v*/*.ts`,
  ];

  const matches = await Promise.all(patterns.map((p) => glob(p)));
  return matches.flat().sort();
}

const VARIANT_TO_RESOLUTION: Record<string, string> = {
  v0: "240p",
  v1: "360p",
  v2: "480p",
  v3: "720p",
  v4: "1080p",
};

function extractVariant(file: string): string {
  const match = file.match(/\/(v\d+)\//);
  if (!match) throw new Error(`Variant not found in ${file}`);
  return match[1]!;
}

function extractSegmentIndex(file: string): number {
  const match = file.match(/segment_(\d+)\.ts$/);
  if (!match) throw new Error(`Segment index not found in ${file}`);
  return Number(match[1]);
}


export const processFileWorker = new Worker(
  "processfile",
  async (job: Job) => {
    const { videoId, originalUrl } = job.data;
    console.log(`Processing video: ${videoId}`);

    if (!videoId || !originalUrl) {
      throw new ApiError(
        ErrorStatus.validationError,
        ErrorMessage.validationError_422
      );
    }

    const metadata = await prisma.metadata.findUnique({
      where: { videoId },
      select: { height: true },
    });

    if (!metadata?.height) {
      throw new ApiError(
        ErrorStatus.internalError,
        "Metadata not found or height is missing"
      );
    }

    const outputDir = path.join(process.cwd(), "public", "processed", videoId);
    fs.mkdirSync(outputDir, { recursive: true });

    console.log("Generating HLS files...");
    await generateProccesFiles(metadata.height, originalUrl, outputDir);

    const files = await getFiles(outputDir);
    console.log(`Found ${files.length} files to upload`);

    const processedFileMap = new Map<string, string>();

    let uploadCount = 0;
    for (const absolutePath of files) {
      const normalized = absolutePath.replace(/\\/g, "/");
      const relativePath = normalized.replace("public/", "");
      const ext = path.extname(relativePath).slice(1) as "m3u8" | "ts";
      const publicId = relativePath.replace(`.${ext}`, "");

      const fileSize = fs.existsSync(absolutePath)
        ? fs.statSync(absolutePath).size
        : 0;

      console.log(`Uploading ${relativePath}...`);
      const upload = await uploadOnCloudinary(
        absolutePath,
        "raw",
        publicId,
        ext
      );

      if (!upload) {
        throw new ApiError(
          ErrorStatus.uploadFailedOnCloud,
          `Failed to upload ${relativePath}`
        );
      }

      uploadCount++;
      console.log(
        `Uploaded ${uploadCount}/${files.length}: ${relativePath}`
      );

      if (relativePath.endsWith("master.m3u8")) {
        await prisma.video.update({
          where: { id: videoId },
          data: {
            masterPlaylistUrl: upload.secure_url,
            status: "HLS_READY",
            progress: 90,
          },
        });
        console.log(" Master playlist stored");
        continue;
      }

      if (relativePath.endsWith("index.m3u8")) {
        const variant = extractVariant(relativePath);

        const processedFile = await prisma.processedFile.upsert({
          where: {
            videoId_variant: { videoId, variant },
          },
          update: {
            indexPlaylistUrl: upload.secure_url,
          },
          create: {
            videoId,
            variant,
            resolution: VARIANT_TO_RESOLUTION[variant]!,
            indexPlaylistUrl: upload.secure_url,
          },
        });

        processedFileMap.set(variant, processedFile.id);
        console.log(`${variant} playlist stored`);
        continue;
      }

      if (relativePath.endsWith(".ts")) {
        const variant = extractVariant(relativePath);
        const segmentIndex = extractSegmentIndex(relativePath);

        const processedFileId = processedFileMap.get(variant);
        if (!processedFileId) {
          throw new Error(`ProcessedFile missing for ${variant}`);
        }

        await prisma.segment.create({
          data: {
            processedFileId,
            segmentIndex,
            url: upload.secure_url,
            size: fileSize, 
            duration: 4.0,
          },
        });
      }
    }

    await prisma.video.update({
      where: { id: videoId },
      data: {
        status: "COMPLETED",
        progress: 100,
      },
    });

    await prisma.jobLog.create({
      data: {
        videoId,
        jobType: "processFile",
        status: "success",
        message: `Successfully processed ${files.length} files`,
      },
    });

    console.log("Cleaning up local files...");
    fs.rmSync(path.join(process.cwd(), "public", "processed"), {
      recursive: true,
      force: true,
    });

    console.log(`Video processing completed: ${videoId}`);
  },
  { connection }
);
