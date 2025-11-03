import { logger } from "@/config/logger";
import { redisConn } from "..";
import { tasks } from "@/tasks";

const NOTIFICATION_CHANNEL = "order-created";

export function setupOrderCreatedSubscriber() {
  redisConn.on("error", (err) => {
    logger.error("[SUBSCRIBER] Redis connection error!");
  });

  redisConn.subscribe(NOTIFICATION_CHANNEL, (err, count) => {
    if (err) {
      logger.error(`[SUBSCRIBER] Error on channel: ${err}`);
    } else {
      logger.info(`[SUBSCRIBER] ${count} channels`);
    }
  });

  redisConn.on("message", async (channel, message) => {
    if (channel == NOTIFICATION_CHANNEL) {
      try {
        const payload = JSON.parse(message);
        await tasks.orderCreated(payload);
      } catch (e) {
        logger.error(`[SUBSCRIBER] JSON error: ${e}`);
      }
    }
  });
}
