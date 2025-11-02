import { logger } from "@/config/logger";
import { Redis } from "ioredis";

const redisConn = new Redis({
  host: Bun.env.REDIS_HOST!,
  port: Number(Bun.env.REDIS_PORT!),
});

export class RedisQueueProvider {
  constructor(private queue_name: string) {}

  public async push(payload: object) {
    try {
      await redisConn.rpush(this.queue_name, JSON.stringify(payload));
    } catch (err) {
      logger.error("Erro ao enviar objeto para a fila!");
    }
  }
}

export class RedisPublisher {
  constructor(private channel_name: string) {}

  public async publish(payload: object) {
    try {
      await redisConn.publish(this.channel_name, JSON.stringify(payload));
    } catch (err) {
      logger.error("Erro ao enviar evento!");
    }
  }
}
