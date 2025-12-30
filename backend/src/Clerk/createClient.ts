import { createClerkClient } from "@clerk/backend";
import { ApiError } from "../Utils/apiError.js";
import {ErrorStatus , ErrorMessage} from "../Enums/enums.js"

if (!process.env.CLERK_SECRET_KEY) {
  throw new Error("Missing Clerk secret key");
}

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const getUser = async(clerkId: string) => {
    const user = await clerkClient.users.getUser(clerkId)

    if(!user) {
        throw new ApiError(ErrorStatus.authMissing, ErrorMessage.authMissing_401);
    }

    return user
}
