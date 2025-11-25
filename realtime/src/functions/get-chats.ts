import { db } from "@/infra/database/conn";
import { chat } from "@/infra/database/tables";
import { eq, or } from "drizzle-orm";

export const getChats = async (
  userId: string
): Promise<(typeof chat.$inferSelect)[]> => {
  const chats = await db
    .select()
    .from(chat)
    .where(or(eq(chat.customerId, userId), eq(chat.memberId, userId)));
  return chats;
};
