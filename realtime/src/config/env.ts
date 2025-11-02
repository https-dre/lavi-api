import Type from "typebox";
import Value from "typebox/value";
import { logger } from "./logger";

const envSchema = Type.Object({
  API_ADDR: Type.String({ format: "idn-hostname" }),
  WS_PORT: Type.String(),
  REDIS_HOST: Type.String({ format: "idn-hostname" }),
});

export function validateEnv() {
  logger.info("Checking Environment...");
  const errors = [...Value.Errors(envSchema, process.env)];
  if (errors.length > 0) {
    errors.map((err) => logger.fatal(`${err.instancePath} ${err.message}`));
    process.exit(1);
  }
  logger.info("Environment ok!");
}
