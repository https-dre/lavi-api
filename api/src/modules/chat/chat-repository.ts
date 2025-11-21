import { db } from "@/infra/database/conn";
import { chat, customer, laundry } from "@/infra/database/tables";
import { AllChatData, ChatModel } from "@/types/models";
import { IChatRepository } from "@/types/repositories";
import { and, eq } from "drizzle-orm";

type ChatNotCreated = typeof chat.$inferInsert;

export class ChatRepository implements IChatRepository {
  public async save(data: ChatNotCreated): Promise<ChatModel> {
    const [created]: ChatModel[] = await db.insert(chat).values(data);
    return created;
  }

  public async findChatsByCustomerId(
    customerId: string
  ): Promise<AllChatData[]> {
    const chats = await db
      .select({
        id: chat.id,
        customer_name: customer.name,
        laundry_name: laundry.name,
        customer_profileUrl: customer.profile_url,
        laundry_profileUrl: laundry.profile_url,
        customerId: chat.customerId,
        laundryId: chat.laundryId,
      })
      .from(chat)
      .innerJoin(customer, eq(chat.customerId, customer.id))
      .innerJoin(laundry, eq(chat.laundryId, laundry.id))
      .where(eq(chat.customerId, customerId));
    return chats;
  }

  public async findChatsByLaundryId(laundryId: string): Promise<AllChatData[]> {
    const chats = await db
      .select({
        id: chat.id,
        customer_name: customer.name,
        laundry_name: laundry.name,
        customer_profileUrl: customer.profile_url,
        laundry_profileUrl: laundry.profile_url,
        customerId: chat.customerId,
        laundryId: chat.laundryId,
      })
      .from(chat)
      .innerJoin(customer, eq(chat.customerId, customer.id))
      .innerJoin(laundry, eq(chat.laundryId, laundry.id))
      .where(eq(chat.laundryId, laundryId));
    return chats;
  }

  public async deleteWithId(id: string): Promise<void> {
    await db.delete(chat).where(eq(chat.id, id));
  }

  public async findOpenChat(
    customerId: string,
    laundryId: string
  ): Promise<AllChatData> {
    const [opened] = await db
      .select({
        id: chat.id,
        customer_name: customer.name,
        laundry_name: laundry.name,
        customer_profileUrl: customer.profile_url,
        laundry_profileUrl: laundry.profile_url,
        customerId: chat.customerId,
        laundryId: chat.laundryId,
      })
      .from(chat)
      .innerJoin(customer, eq(chat.customerId, customer.id))
      .innerJoin(laundry, eq(chat.laundryId, laundry.id))
      .where(
        and(eq(chat.customerId, customerId), eq(chat.laundryId, laundryId))
      );
    return opened;
  }

  public async findById(id: string): Promise<AllChatData> {
    const [chatWithId] = await db
      .select({
        id: chat.id,
        customer_name: customer.name,
        laundry_name: laundry.name,
        customer_profileUrl: customer.profile_url,
        laundry_profileUrl: laundry.profile_url,
        customerId: chat.customerId,
        laundryId: chat.laundryId,
      })
      .from(chat)
      .innerJoin(customer, eq(chat.customerId, customer.id))
      .innerJoin(laundry, eq(chat.laundryId, laundry.id))
      .where(eq(chat.id, id));
    return chatWithId;
  }
}
