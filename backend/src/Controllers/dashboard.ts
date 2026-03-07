import {
  ErrorMessage,
  ErrorStatus,
  SuccessMessage,
  SuccessStatus,
} from "../Enums/enums.js";
import { ApiError } from "../Utils/apiError.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { prisma } from "../db/index.js";
import { ApiResponse } from "../Utils/apiResonse.js";

export const getStats = asyncHandler(async (req, res) => {
  const { id, storage } = req.user;

  if (!id) {
    throw new ApiError(ErrorStatus.notFound, ErrorMessage.notFound_404);
  }

  const totalVideos = await prisma.video.aggregate({
    where: {
      userId: id,
    },
    _count: true
  });

  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const InQueue = await prisma.video.aggregate({
    where: {
      userId: id,
      createdAt: { gte: last24Hours },
      NOT: {
        status: "COMPLETED",
      },
    },
    _count: true
  });

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const todayStats = await prisma.video.aggregate({
    where: {
      userId: id,
      createdAt: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
    _count: true,
  });

  console.log("Total videos: ", totalVideos)
  console.log("InQueue", InQueue)
  console.log("Completed Today: ", todayStats)
  console.log("Storae: ", storage)

  return res
    .status(SuccessStatus.ok)
    .json(
      new ApiResponse(
        SuccessStatus.ok,
        { totalVideos, InQueue, todayStats, storage },
        SuccessMessage.ok_200,
      ),
    );
});

// Helper to format bytes into human-readable size
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + sizes[i]!;
}

// Helper to format duration (seconds) into mm:ss
function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return "--:--";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// Helper to get relative time string
function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

export const getRecentActivity = asyncHandler(async (req, res) => {
  const { id } = req.user;

  if (!id) {
    throw new ApiError(ErrorStatus.notFound, ErrorMessage.notFound_404);
  }

  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const videos = await prisma.video.findMany({
    where: {
      userId: id,
      createdAt: { gte: last24Hours },
    },
    orderBy: { createdAt: "desc" },
    include: {
      metadata: true,
      processedFiles: {
        include: {
          segments: true,
        },
      },
    },
  });

  const recentVideos = videos.map((video) => {
    // Calculate total size from all segments across all processed files
    const totalSize = video.processedFiles.reduce((acc, pf) => {
      return acc + pf.segments.reduce((segAcc, seg) => segAcc + (seg.size || 0), 0);
    }, 0);

    // Get the original file extension as format
    const originalUrl = video.originalUrl || "";
    const format = originalUrl.split(".").pop()?.toUpperCase() || "MP4";

    return {
      id: video.id,
      name: video.title || originalUrl.split("/").pop() || "Untitled",
      size: totalSize > 0 ? formatBytes(totalSize) : "—",
      format: format,
      duration: formatDuration(video.metadata?.duration),
      status: video.status,
      progress: video.progress,
      uploadedAt: timeAgo(video.createdAt),
      createdAt: video.createdAt,
    };
  });

  return res
    .status(SuccessStatus.ok)
    .json(
      new ApiResponse(
        SuccessStatus.ok,
        { recentVideos },
        SuccessMessage.ok_200,
      ),
    );
});

export const getProcessingQueue = asyncHandler(async (req, res) => {
  const { id } = req.user;

  if (!id) {
    throw new ApiError(ErrorStatus.notFound, ErrorMessage.notFound_404);
  }

  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const videos = await prisma.video.findMany({
    where: {
      userId: id,
      createdAt: { gte: last24Hours },
      NOT: {
        status: { in: ["COMPLETED", "FAILED"] },
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      metadata: true,
    },
  });

  const processingVideos = videos.map((video) => {
    const originalUrl = video.originalUrl || "";
    return {
      id: video.id,
      fileName: video.title || originalUrl.split("/").pop() || "Untitled",
      progress: video.progress,
      status: video.status,
      createdAt: video.createdAt,
    };
  });

  return res
    .status(SuccessStatus.ok)
    .json(
      new ApiResponse(
        SuccessStatus.ok,
        { processingVideos },
        SuccessMessage.ok_200,
      ),
    );
});
