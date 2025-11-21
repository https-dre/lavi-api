import Elysia from "elysia";
import { createChat } from "./create-chat";
import { appServices } from "@/generators";
import { getCustomerChats } from "./get-customer-chats";
import { getLaundryChats } from "./get-laundry-chats";

const chatController = new Elysia();
chatController.use(createChat(appServices.chat));
chatController.use(getCustomerChats(appServices.chat));
chatController.use(getLaundryChats(appServices.chat));

export { chatController };
