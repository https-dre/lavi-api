import { treaty } from "@elysiajs/eden";
import { App } from "@/http/app";
import * as dotenv from "dotenv";

const envFile =
	process.env.NODE_ENV === "production" ? "../.env.production" : "../.env.development";
dotenv.config({ path: envFile, override: true });

const api_spec = treaty(App);
export { api_spec };
