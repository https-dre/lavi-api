import { treaty } from "@elysiajs/eden";
import type { App_t } from "@/http/app";

const PORT = Bun.env.PORT ? Bun.env.PORT : "3000"
const api = treaty<App_t>(`localhost:${PORT}`);