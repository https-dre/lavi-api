import { logger } from "@/config/logger";
import { redisConn } from "..";

const queue_name = "lavi_notification_queue";

export const executeTask = async (data: any) => {
  logger.info("Task executando.");
};

export const initNotificationQueue = async () => {
  redisConn.on("error", (err) => {
    logger.error(err);
  });

  while (true) {
    try {
      const result = await redisConn.blpop(queue_name, 0);

      if (result) {
        const [fila, mensagem] = result;
        logger.info("New REDIS message received.");

        try {
          await executeTask(mensagem);
        } catch (processError) {
          logger.fatal("Redis error");
        }
      }
    } catch (error) {
      logger.info(`Erro inesperado no loop worker: ${error}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};