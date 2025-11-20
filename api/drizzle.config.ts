import { defineConfig } from "drizzle-kit";

import * as dotenv from "dotenv";

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

dotenv.config({ path: envFile });

export default defineConfig({
  out: "./drizzle",
  schema: "./src/infra/database/tables/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
