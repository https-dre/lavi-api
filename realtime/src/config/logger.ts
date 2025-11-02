import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

const loggerOptions = isProduction
  ? {
      level: "info",
    }
  : {
      level: "debug",
      transport: {
        target: "pino-pretty",
        options: {
          colorize: false,
          translateTime: "SYS:standard", // Formato de hora mais curto
          ignore: "pid,hostname",
        },
      },
    };

export const logger = pino(loggerOptions);
