import { getUnreadCount } from "@/functions/count-unread-messages";
import Elysia from "elysia";

export const getUnreadMessagesCount = () => {
  return new Elysia().get(
    "/chats/messages/unread/:sender_id/:chat_id",
    async ({ params, status }) => {
      const count = await getUnreadCount(params.chat_id, params.sender_id);
      return status(200, { count });
    }
  );
};
