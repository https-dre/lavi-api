import { logger } from "@/config/logger";
import { Redis } from "ioredis";

const redisConn = new Redis({
  host: Bun.env.REDIS_HOST!,
  port: Number(Bun.env.REDIS_PORT!),
});

export { redisConn };
