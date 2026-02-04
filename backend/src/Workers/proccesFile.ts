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
import { publisher } from "./redisClient";

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

function rewriteM3u8(content: string, map: Record<string, string>) {
  let updated = content;

  for (const [local, cloud] of Object.entries(map)) {
    updated = updated.replaceAll(local, cloud);
  }

  return updated;
}

export const processFileWorker = new Worker(
  "processfile",
  async (job: Job) => {
    const { videoId, originalUrl } = job.data;
    const segmentUrlMap: Record<string, string> = {};
    const variantUrlMap: Record<string, string> = {};
    console.log(`\n========================================`);
    console.log(`Processing video: ${videoId}`);
    console.log(`========================================\n`);

    if (!videoId || !originalUrl) {
      throw new ApiError(
        ErrorStatus.validationError,
        ErrorMessage.validationError_422,
      );
    }

    const metadata = await prisma.metadata.findUnique({
      where: { videoId },
      select: { height: true },
    });

    if (!metadata?.height) {
      throw new ApiError(
        ErrorStatus.internalError,
        "Metadata not found or height is missing",
      );
    }

    const outputDir = path.join(process.cwd(), "public", "processed", videoId);
    fs.mkdirSync(outputDir, { recursive: true });

    console.log("🎬 Generating HLS files...");
    await generateProccesFiles(metadata.height, originalUrl, outputDir);

    const files = await getFiles(outputDir);
    console.log(`📂 Found ${files.length} files to upload\n`);

    const processedFileMap = new Map<string, string>();

    console.log("📝 STEP 1: Creating processed files in DB...");
    const indexPlaylists = files.filter(
      (f) => f.endsWith("index.m3u8") && !f.endsWith("master.m3u8"),
    );

    for (const absolutePath of indexPlaylists) {
      const normalized = absolutePath.replace(/\\/g, "/");
      const relativePath = normalized.replace("public/", "");
      const variant = extractVariant(relativePath);

      const processedFile = await prisma.processedFile.upsert({
        where: { videoId_variant: { videoId, variant } },
        update: {},
        create: {
          videoId,
          variant,
          resolution: VARIANT_TO_RESOLUTION[variant]!,
          indexPlaylistUrl: "",
        },
      });

      processedFileMap.set(variant, processedFile.id);
      console.log(
        `  ✓ Created ${variant} (${VARIANT_TO_RESOLUTION[variant]}): ${processedFile.id}`,
      );
    }

    console.log("\n📤 STEP 2: Uploading segments...");
    const segments = files.filter((f) => f.endsWith(".ts"));
    let segmentCount = 0;

    for (const absolutePath of segments) {
      const normalized = absolutePath.replace(/\\/g, "/");
      const relativePath = normalized.replace("public/", "");
      const publicId = relativePath.replace(".ts", "");
      const fileSize = fs.statSync(absolutePath).size;

      const variant = extractVariant(relativePath);
      const segmentIndex = extractSegmentIndex(relativePath);

      const upload = await uploadOnCloudinary(
        absolutePath,
        "raw",
        publicId,
        "ts",
      );

      if (!upload) {
        throw new ApiError(
          ErrorStatus.uploadFailedOnCloud,
          `Failed to upload ${relativePath}`,
        );
      }

      const fileName = path.basename(relativePath);
      segmentUrlMap[fileName] = upload.url;

      const processedFileId = processedFileMap.get(variant);
      if (!processedFileId) {
        console.error(`❌ ProcessedFile missing for ${variant}`);
        throw new Error(`ProcessedFile missing for ${variant}`);
      }

      await prisma.segment.create({
        data: {
          processedFileId,
          segmentIndex,
          url: upload.url,
          size: fileSize,
          duration: 6.0,
        },
      });

      segmentCount++;
      console.log(
        `  ✓ [${segmentCount}/${segments.length}] ${variant}/segment_${segmentIndex}.ts`,
      );
    }

    console.log("\n📋 STEP 3: Uploading variant playlists...");

    for (const absolutePath of indexPlaylists) {
      const normalized = absolutePath.replace(/\\/g, "/");
      const relativePath = normalized.replace("public/", "");
      const publicId = relativePath.replace(".m3u8", "");

      // 1. Read
      let content = fs.readFileSync(absolutePath, "utf-8");

      // 2. Rewrite segments
      content = rewriteM3u8(content, segmentUrlMap);

      // 3. Save
      fs.writeFileSync(absolutePath, content);

      // 4. Upload
      const upload = await uploadOnCloudinary(
        absolutePath,
        "raw",
        publicId,
        "m3u8",
      );

      if (!upload) {
        throw new ApiError(
          ErrorStatus.uploadFailedOnCloud,
          `Failed to upload ${relativePath}`,
        );
      }

      const variant = extractVariant(relativePath);

      // Store variant URL for master playlist
      const variantPath = `${variant}/index.m3u8`;
      variantUrlMap[variantPath] = upload.url;

      console.log(`  ✓ ${variant}/index.m3u8 → Cloudinary`);

      // Update processedFile with index playlist URL
      await prisma.processedFile.update({
        where: { videoId_variant: { videoId, variant } },
        data: { indexPlaylistUrl: upload.url },
      });
    }

    console.log("\n🎯 STEP 4: Uploading master playlist...");
    const masterPath = files.find((f) => f.endsWith("master.m3u8"));

    if (masterPath) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const normalized = masterPath.replace(/\\/g, "/");
      const publicId = `processed/${videoId}/master`;

      console.log(`\n📍 Master Playlist Upload Details:`);
      console.log(`   Public ID: ${publicId}`);

      // Read and rewrite
      let content = fs.readFileSync(masterPath, "utf-8");
      content = rewriteM3u8(content, variantUrlMap);
      fs.writeFileSync(masterPath, content);

      console.log("\n--- Final master.m3u8 content ---");
      console.log(content);

      // Upload
      const upload = await uploadOnCloudinary(
        masterPath,
        "raw",
        publicId,
        "m3u8",
      );

      if (!upload) {
        throw new ApiError(
          ErrorStatus.uploadFailedOnCloud,
          "Failed to upload master.m3u8",
        );
      }

      console.log(`\n✅ Master Playlist Uploaded!`);
      console.log(`   URL: ${upload.url}`);
      console.log(`   Secure URL: ${upload.secure_url}`);

      // ✅ CRITICAL: Construct proper master.m3u8 URL
      // Cloudinary raw files need explicit .m3u8 extension in URL
      const baseUrl = upload.secure_url || upload.url;

      // Method 1: If cloudinary returns URL without extension, add it
      let masterUrl = baseUrl;
      if (!masterUrl.endsWith(".m3u8")) {
        // Replace upload response URL with proper format
        const parts = upload.public_id.split("/");
        masterUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/v${upload.version}/${upload.public_id}.m3u8`;
      }

      console.log(`\n🔗 Final Master URL: ${masterUrl}`);

      // Test if URL is accessible
      console.log(`\n🧪 Testing master playlist accessibility...`);
      try {
        const testResponse = await fetch(masterUrl);
        const testText = await testResponse.text();
        console.log(`✅ Master playlist accessible!`);
        console.log(`   Response length: ${testText.length} bytes`);
      } catch (error) {
        console.error(`❌ Master playlist NOT accessible:`, error);
      }

      // Save to database
      await prisma.video.update({
        where: { id: videoId },
        data: {
          masterPlaylistUrl: masterUrl,
          status: "HLS_READY",
          progress: 90,
        },
      });

      console.log(`✅ Database updated with: ${masterUrl}\n`);
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

    console.log("🧹 Cleaning up local files...");
    fs.rmSync(path.join(process.cwd(), "public", "processed"), {
      recursive: true,
      force: true,
    });

    console.log(`\n✅ Video processing completed: ${videoId}`);
    console.log(`========================================\n`);
  },
  { connection, concurrency: 1, lockDuration: 600000 },
);
