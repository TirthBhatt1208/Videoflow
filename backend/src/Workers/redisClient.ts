import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config({ override: false });

export const publisher = createClient({ url: process.env.REDIS_URL! });
export const subscriber = createClient({ url: process.env.REDIS_URL! });

await publisher.connect();
await subscriber.connect();
