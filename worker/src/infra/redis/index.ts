import { logger } from "@/config/logger";
import Redis from "ioredis";

const redis = new Redis({
  host: Bun.env.REDIS_HOST!,
  db: 0,
  port: Number(Bun.env.REDIS_PORT),
});

const queue_name = "lavi_notification_queue";

export const executeTask = async (data: any) => {
  logger.info("Task executando.");
};

const initWorker = async () => {
  redis.on("error", (err) => {
    logger.error(err);
  });

  while (true) {
    try {
      const result = await redis.blpop(queue_name, 0);

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

async function sendMessages(message: string) {
  await redis.rpush(queue_name, message);
}

export { initWorker };
