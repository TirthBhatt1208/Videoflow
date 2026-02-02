import { prisma } from "../db/index.js";
import { ApiError } from "../Utils/apiError.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { getUser } from "../Clerk/createClient";
import { ErrorStatus, ErrorMessage } from "../Enums/enums.js";

export const checkStrorage = asyncHandler(async (req, res, next) => {
  if (!req.files || Array.isArray(req.files)) {
    throw new ApiError(ErrorStatus.uploadNoFile, ErrorMessage.uploadNoFile_400);
  }
  const videos = req.files["videos"];
  const {storage , id} = req.user

  if(storage >= 10) {
    throw new ApiError(ErrorStatus.storageFailed , ErrorMessage.storageFailed_400)
  }

  let newStorage = 0
  videos?.forEach((video) => {
    let size = video.size

    size = size / (1024 * 1024 * 1024)

    newStorage += size
  })

  if(newStorage + storage >= 10) {
    throw new ApiError(ErrorStatus.storageProviderError , ErrorMessage.storageProviderError_403)
  }

  newStorage += storage
  console.log("New Storage: " , newStorage)
  console.log("ID: " , id)
  const updated = await prisma.user.update({
    where: {
        id
    },
    data: {
        storage: newStorage
    }
  })

  console.log("Updated User Storage: " , updated)
  next()
});
