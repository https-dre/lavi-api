import { drizzle } from "drizzle-orm/node-postgres";
import { logger } from "../../config/logger";

export const db = drizzle(process.env.DATABASE_URL!);

export const check_db = async () => {
  logger.info("Checking database connection...");
  try {
    await db.execute("SELECT 1");
  } catch (err) {
    logger.fatal("DATABASE CONNECTION ERROR!");
    throw err;
  }
  logger.info("Database connection ok!");
};
