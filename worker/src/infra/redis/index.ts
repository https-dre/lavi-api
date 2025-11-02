import { logger } from "@/config/logger";
import Redis from "ioredis";
import { initNotificationQueue } from "./queues/notification";

const redisConn = new Redis({
  host: Bun.env.REDIS_HOST!,
  db: 0,
  port: Number(Bun.env.REDIS_PORT),
});

const initWorker = async () => {
  initNotificationQueue();
  logger.info("Redis worker initialized!");
};

export { redisConn, initWorker };
