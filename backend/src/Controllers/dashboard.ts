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
  const { id , storage } = req.user;

  if (!id) {
    throw new ApiError(ErrorStatus.notFound, ErrorMessage.notFound_404);
  }

  const totalVideos = await prisma.video.aggregate({
    where: {
      userId: id,
    },
    _count:true
  });

  const InQueue = await prisma.video.aggregate({
    where: {
      userId: id,
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
      createdAt: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
    _count: true,
  });

  console.log("Total videos: " , totalVideos)
  console.log("InQueue" , InQueue)
  console.log("Completed Today: " , todayStats)
  console.log("Storae: " , storage)

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
