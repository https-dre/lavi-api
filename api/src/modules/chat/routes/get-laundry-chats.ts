import Elysia, { t } from "elysia";
import { ChatService } from "../chat-service";

export const getLaundryChats = (service: ChatService) => {
  return new Elysia().get(
    "/chats/laundry/:laundryId",
    async ({ params, status }) => {
      const { laundryId } = params;
      const chats = await service.getLaundryChats(laundryId);
      return status(200, { chats });
    },
    {
      detail: {
        summary: "Get laundry chats",
        tags: ["laundries", "chats"],
      },
      params: t.Object({
        laundryId: t.String({ format: "uuid" }),
      }),
    }
  );
};
