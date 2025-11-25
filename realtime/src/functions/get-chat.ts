import { db } from "@/infra/database/conn";
import { chat } from "@/infra/database/tables";
import { eq } from "drizzle-orm";

export const getChat = async (
  chat_id: string
): Promise<typeof chat.$inferSelect | undefined> => {
  const rows = await db.select().from(chat).where(eq(chat.id, chat_id));
  return rows[0];
};
