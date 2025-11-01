import { executeServer } from "@/infra/server/server";
import { executeInClusterMode } from "@/infra/server/cluster-mode";
import { logger } from "@/config/logger";

if(process.env.NODE_ENV == "production") {
  logger.info("Executing in cluster mode.")
  executeInClusterMode();
} else {
  executeServer();
}