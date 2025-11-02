import { RedisPublisher } from "@/infra/providers/redis";

const redisProvider = {
  orderCreatedPublisher: new RedisPublisher("order-created"),
};

export { redisProvider };
