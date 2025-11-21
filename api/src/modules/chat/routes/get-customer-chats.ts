import Elysia, { t } from "elysia";
import { ChatService } from "../chat-service";

export const getCustomerChats = (service: ChatService) => {
  return new Elysia().get(
    "/chats/customer/:customerId",
    async ({ params, status }) => {
      const { customerId } = params;
      const chats = await service.getCustomerChats(customerId);
      return status(200, { chats });
    },
    {
      detail: {
        summary: "Get customer chats",
        tags: ["customer", "chats"],
      },
      params: t.Object({
        customerId: t.String({ format: "uuid" }),
      }),
    }
  );
};
