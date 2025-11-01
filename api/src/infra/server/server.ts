import { verify_env } from "@/config/env-config";
import { logger } from "@/config/logger";
import { check_db } from "../database/conn";
import { App } from "../http/app";

export const executeServer = async () => {
  verify_env();
  await check_db();

  const port_from_env = Bun.env.PORT!;
  const current_port = port_from_env ? port_from_env : "5555";

  logger.info(`Server running at: http://localhost:${current_port}`);
  App.listen(Number(current_port));
};
