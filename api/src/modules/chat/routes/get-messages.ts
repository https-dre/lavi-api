import { db } from "@/infra/database/conn";
import { chatMessage } from "@/infra/database/tables";
import { desc, eq } from "drizzle-orm";
import Elysia from "elysia";

export const getMessagesWithChatId = () => {
  return new Elysia().get(
    "/messages/:chat_id",
    async ({ params, status }) => {
      const { chat_id } = params;
      const messages = await db
        .select()
        .from(chatMessage)
        .where(eq(chatMessage.chat_id, chat_id));
      if (messages.length == 0) {
        return status(404, { messages });
      }

      return status(200, { messages });
    }
  );
};
