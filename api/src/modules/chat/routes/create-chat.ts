import Elysia, { t } from "elysia";
import { ChatService } from "../chat-service";
import { ChatType } from "@/types/typebox";

export const createChat = (service: ChatService) => {
  return new Elysia().patch(
    "/chats",
    async ({ body, status }) => {
      const { chat } = body;
      const created = await service.createChat(chat);
      return status(200, { chat: created });
    },
    {
      detail: {
        summary: "Create chat",
        tags: ["chats"],
      },
      body: t.Object({
        chat: t.Omit(ChatType, ["id", "created_at"]),
      }),
    }
  );
};
