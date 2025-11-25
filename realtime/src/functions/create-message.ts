import { db } from "@/infra/database/conn";
import { chatMessage } from "../infra/database/tables/schema/chat-message";

export const createMessage = async (
  data: typeof chatMessage.$inferInsert
): Promise<typeof chatMessage.$inferSelect | undefined> => {
  const rows = await db.insert(chatMessage).values(data).returning();
  return rows[0];
};
