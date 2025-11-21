import { chat } from "@/infra/database/tables";
import { AllChatData, ChatModel } from "@/types/models";

type ChatNotCreated = typeof chat.$inferInsert;
export interface IChatRepository {
  save(data: ChatNotCreated): Promise<ChatModel>;
  findChatsByCustomerId(customerId: string): Promise<AllChatData[]>;
  findById(id: string): Promise<AllChatData>;
  findChatsByLaundryId(laundryId: string): Promise<AllChatData[]>;
  findOpenChat(customerId: string, laundryId: string): Promise<AllChatData>;
  deleteWithId(id: string): Promise<void>;
}