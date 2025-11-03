import { validateEnv } from "./config/env";
import { logger } from "./config/logger";
import { setupOrderCreatedSubscriber } from "./infra/redis/subscribers/order-created";
import { ioServer } from "./infra/socket.io/server";

validateEnv();
logger.info(`API_ADDR: ${Bun.env.API_ADDR}`);
logger.info("Starting Socket.IO Server");
setupOrderCreatedSubscriber();
ioServer.listen(Number(Bun.env.WS_PORT || "3300"));