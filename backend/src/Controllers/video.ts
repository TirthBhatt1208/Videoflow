import { ErrorMessage, ErrorStatus, SuccessMessage, SuccessStatus } from "../Enums/enums.js";
import { ApiError } from "../Utils/apiError.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { uploadOnCloudinary } from "../Utils/cloudinary.js";
import { prisma } from "../db/index.js";
import { ApiResponse } from "../Utils/apiResonse.js";
import { addToMetaDataQueue } from "../Queues/metaData.js";

const uploadVideo = asyncHandler(async (req, res) => {
  if (!req.files || Array.isArray(req.files)) {
    throw new ApiError(ErrorStatus.uploadNoFile, ErrorMessage.uploadNoFile_400);
  }

  const videos = req.files["videos"];
  const { title, description } = req.body;

  if (!videos || videos.length === 0) {
    throw new ApiError(ErrorStatus.uploadNoFile, ErrorMessage.uploadNoFile_400);
  }

  const user = req.user;
  const savedVideos = [];
  console.log("Videos: " , videos)
  for (const video of videos) {
    const response = await uploadOnCloudinary(video.path);

    if (!response) {
      throw new ApiError(
        ErrorStatus.uploadFailedOnCloud,
        ErrorMessage.uploadFailedOnCloud_500
      );
    }

    const dbVideo = await prisma.video.create({
      data: {
        userId: user.id,
        originalUrl: response.url,
        title: title || "",
        description: description || "",
      },
    });
    
    if (!dbVideo) {
      throw new ApiError(
        ErrorStatus.uploadFailed,
        ErrorMessage.uploadFailed_500
      );
    }

    savedVideos.push(dbVideo);
  }

  savedVideos.map(async (video , idx) => {
    await addToMetaDataQueue(video, user.clerkId , idx);
  })

  return res
    .status(SuccessStatus.uploadSuccess)
    .json(
      new ApiResponse(
        SuccessStatus.uploadSuccess,
        savedVideos,
        SuccessMessage.uploadSuccess_201
      )
    );
});
const getCloudUrls = asyncHandler(async (req, res) => {
  const { id } = req.user;

  if (!id) {
    throw new ApiError(404, "Id not found!!");
  }

  const videos = await prisma.video.findMany({
    take: 10,
    where: {
      userId: id,
      vttUrl: {
        not: null,
      },
      masterPlaylistUrl: {
        not: null,
      },
    },
    select: {
      id: true,
      vttUrl: true,
      masterPlaylistUrl: true,
      thumbnail: {
        take: 1,
        select: {
          url: true,
        },
      },
    },
  });

  if (!videos) {
    throw new ApiError(500, "videos not found due to internal server erorr!");
  }

  console.log(" Videos: ", videos);

  return res
    .status(SuccessStatus.ok)
    .json(
      new ApiResponse(SuccessStatus.ok, { videos }, "Urls Sent succesfully"),
    );
});
export { uploadVideo, getCloudUrls };
