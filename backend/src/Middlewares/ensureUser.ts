import { prisma } from "../db/index";
import { ApiError } from "../Utils/apiError";
import { asyncHandler } from "../Utils/asyncHandler";
import {getUser} from "../Clerk/createClient"
import { ErrorStatus, ErrorMessage } from "../Enums/enums";

export const ensureUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.auth!;

  if (!userId) {
    throw new ApiError(ErrorStatus.authMissing , ErrorMessage.authMissing_401);
  }

  const email = (await getUser(userId)).emailAddresses[0]?.emailAddress
  
  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { clerkId: userId , email: email || "" },
    });
  }

  req.user = user;

  next();
});
