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

/* ---------------- PLAYLIST REWRITE HELPERS ---------------- */

function rewriteIndexPlaylist(
  indexPath: string,
  segmentMap: Map<string, string>,
) {
  let lines = fs.readFileSync(indexPath, "utf8").split("\n");

  lines = lines.map((line) => {
    const trimmed = line.trim();

    // sirf segment lines replace karo
    if (trimmed.endsWith(".ts")) {
      for (const [localAbsPath, cloudUrl] of segmentMap.entries()) {
        const fileName = path.basename(localAbsPath);

        if (trimmed === fileName) {
          return cloudUrl;
        }
      }
    }

    return line;
  });

  fs.writeFileSync(indexPath, lines.join("\n"));
}


function rewriteMasterPlaylist(
  masterPath: string,
  indexMap: Map<string, string>,
) {
  let lines = fs.readFileSync(masterPath, "utf8").split("\n");

  lines = lines.map((line) => {
    const trimmed = line.trim();

    if (trimmed.endsWith(".m3u8")) {
      const cloudUrl = indexMap.get(trimmed);
      if (cloudUrl) return cloudUrl;
    }

    return line;
  });

  fs.writeFileSync(masterPath, lines.join("\n"));
}


/* ---------------- FILE COLLECTOR ---------------- */

async function getFiles(outputDir: string): Promise<string[]> {
  const patterns = [
    `${outputDir}/*.m3u8`,
    `${outputDir}/v*/index.m3u8`,
    `${outputDir}/v*/*.ts`,
  ];
  const matches = await Promise.all(patterns.map((p) => glob(p)));
  return matches.flat().sort();
}

/* ---------------- WORKER ---------------- */

export const processFileWorker = new Worker(
  "processfile",
  async (job: Job) => {
    const { videoId, originalUrl } = job.data;
    if (!videoId || !originalUrl) {
      throw new ApiError(
        ErrorStatus.validationError,
        ErrorMessage.validationError_422,
      );
    }

    console.log(`Processing video: ${videoId}`);

    const metadata = await prisma.metadata.findUnique({
      where: { videoId },
      select: { height: true },
    });

    if (!metadata?.height) {
      throw new ApiError(
        ErrorStatus.internalError,
        "Metadata not found or height missing",
      );
    }

    const outputDir = path.join(process.cwd(), "public", "processed", videoId);
    fs.mkdirSync(outputDir, { recursive: true });

    /* -------- GENERATE HLS -------- */
    await generateProccesFiles(metadata.height, originalUrl, outputDir);

    const files = await getFiles(outputDir);

    const segmentUrlMap = new Map<string, string>();
    const indexUrlMap = new Map<string, string>();

    /* =====================================================
       PASS 1 — UPLOAD ONLY TS FILES
    ====================================================== */
    for (const abs of files) {
      if (!abs.endsWith(".ts")) continue;

      const normalized = abs.replace(/\\/g, "/");
      const relativePath = normalized.replace("public/", "");

      const upload = await uploadOnCloudinary(
        abs,
        "raw",
        relativePath.replace(".ts", ""),
        "ts",
      );

      if (!upload) throw new Error("TS Upload Failed");

      segmentUrlMap.set(abs, upload.secure_url);
      console.log("TS Uploaded:", relativePath);
    }

    /* =====================================================
       PASS 2 — REWRITE INDEX PLAYLISTS
    ====================================================== */
    const indexFiles = files.filter((f) => f.endsWith("index.m3u8"));

    for (const indexPath of indexFiles) {
      rewriteIndexPlaylist(indexPath, segmentUrlMap);
    }

    /* =====================================================
       PASS 3 — UPLOAD INDEX PLAYLISTS
    ====================================================== */
    for (const indexPath of indexFiles) {
      const normalized = indexPath.replace(/\\/g, "/");
      const relativePath = normalized.replace("public/", "");

      const upload = await uploadOnCloudinary(
        indexPath,
        "raw",
        relativePath.replace(".m3u8", ""),
        "m3u8",
      );

      if (!upload) throw new Error("Index Upload Failed");

      // store for master rewrite
      const shortPath = relativePath.replace(`processed/${videoId}/`, "");
      indexUrlMap.set(shortPath, upload.secure_url);

      console.log("Index Uploaded:", shortPath);
    }

    /* =====================================================
       PASS 4 — REWRITE MASTER
    ====================================================== */
    const masterPath = path.join(outputDir, "master.m3u8");
    rewriteMasterPlaylist(masterPath, indexUrlMap);

    /* =====================================================
       PASS 5 — UPLOAD MASTER
    ====================================================== */
    const masterUpload = await uploadOnCloudinary(
      masterPath,
      "raw",
      `processed/${videoId}/master`,
      "m3u8",
    );

    if (!masterUpload) throw new Error("Master Upload Failed");

    await prisma.video.update({
      where: { id: videoId },
      data: {
        masterPlaylistUrl: masterUpload.secure_url,
        status: "COMPLETED",
        progress: 100,
      },
    });

    console.log("Master Uploaded");

    /* =====================================================
       CLEANUP LOCAL FILES
    ====================================================== */
    fs.rmSync(path.join(process.cwd(), "public", "processed"), {
      recursive: true,
      force: true,
    });

    console.log(`Processing complete for ${videoId}`);
  },
  { connection, concurrency: 1, lockDuration: 600000 },
);
