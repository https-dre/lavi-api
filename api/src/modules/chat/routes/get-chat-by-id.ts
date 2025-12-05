import Elysia from "elysia";
import { ChatService } from "../chat-service";

export const getChatById = (service: ChatService) => {
  return new Elysia().get('/chats/:chat_id', async ({ params, status }) => {
    const { chat_id } = params;
    const chat = await service.getChatById(chat_id);
    return status(200, { chat });
  })
}