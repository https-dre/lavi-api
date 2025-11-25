import { db } from "@/infra/database/conn";
import { chat } from "@/infra/database/tables";
import { eq } from "drizzle-orm";

export const checkIfChatExists = async (chatId: string) => {
  const rows = await db
    .select({ id: chat.id })
    .from(chat)
    .where(eq(chat.id, chatId));
  return rows.length > 0;
};
