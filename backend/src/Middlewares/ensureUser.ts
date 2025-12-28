import { prisma } from "../db/index";
import { ApiError } from "../Utils/apiError";
import { asyncHandler } from "../Utils/asyncHandler";

const ensureUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.auth!;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { clerkId: userId, role: "user" },
    });
  }

  req.user = user;

  next();
});
