import { validateEnv } from "./config";
import { logger } from "./logger";
import { ioServer } from "./socket/server";

validateEnv();
logger.info(`API_ADDR: ${Bun.env.API_ADDR}`);
logger.info("Starting Socket.IO Server");
ioServer.listen(Number(Bun.env.WS_PORT || "3300"));
