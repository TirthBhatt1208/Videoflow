import { original } from "@reduxjs/toolkit";
import { ErrorMessage, ErrorStatus, SuccessMessage, SuccessStatus } from "../Enums/enums.js";
import { ApiError } from "../Utils/apiError.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { uploadOnCloudinary } from "../Utils/cloudinary.js";
import { prisma } from "../db/index.js";
import { ApiResponse } from "../Utils/apiResonse.js";
import { json } from "node:stream/consumers";

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

  return res
    .status(SuccessStatus.uploadSuccess)
    .json(
      new ApiResponse(
        SuccessStatus.uploadSuccess,
        savedVideos[0],
        SuccessMessage.uploadSuccess_201
      )
    );
});

export { uploadVideo };
