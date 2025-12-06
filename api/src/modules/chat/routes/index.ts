import Elysia from "elysia";
import { createChat } from "./create-chat";
import { appServices } from "@/generators";
import { getCustomerChats } from "./get-customer-chats";
import { getLaundryChats } from "./get-laundry-chats";
import { getMessagesWithChatId } from "./get-messages";
import { getChatById } from "./get-chat-by-id";
import { getUnreadMessagesCount } from "./get-unread-count";

const chatController = new Elysia();
chatController.use(createChat(appServices.chat));
chatController.use(getCustomerChats(appServices.chat));
chatController.use(getLaundryChats(appServices.chat));
chatController.use(getMessagesWithChatId());
chatController.use(getChatById(appServices.chat));
chatController.use(getUnreadMessagesCount());

export { chatController };
