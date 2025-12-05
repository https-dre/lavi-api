import { db } from "@/infra/database/conn";
import { chatMessage } from "@/infra/database/tables";
import { BadResponse } from "@/infra/http/error-handler";
import { CryptoProvider } from "@/infra/providers/crypto-provider";
import { ChatModel } from "@/types/models";
import {
  ICustomerRepository,
  ILaundryRepository,
  IMemberRepository,
} from "@/types/repositories";
import { IChatRepository } from "@/types/repositories/interfaces/chat";
import { eq } from "drizzle-orm";

export class ChatService {
  constructor(
    private repository: IChatRepository,
    private customerRepository: ICustomerRepository,
    private laundryRepository: ILaundryRepository,
    private memberRepository: IMemberRepository,
    private cryptoProvider: CryptoProvider
  ) {}

  public async createChat(data: Omit<ChatModel, "id" | "created_at">) {
    const [customer, laundry, chat, member] = await Promise.all([
      this.customerRepository.findById(data.customerId),
      this.laundryRepository.findById(data.laundryId),
      this.repository.findOpenChat(data.customerId, data.laundryId),
      data.memberId
        ? this.memberRepository.findById(data.memberId)
        : Promise.resolve(null),
    ]);

    if (chat) return chat;

    if (!customer) throw new BadResponse("Cliente não encontrado.", 404);

    if (!laundry) throw new BadResponse("Lavanderia não encontrada.", 404);

    if (data.memberId && !member)
      throw new BadResponse("Membro não encontrado.", 404);

    const created = await this.repository.save(data);
    return created;
  }

  public async getCustomerChats(customerId: string) {
    const [customer, chats] = await Promise.all([
      this.customerRepository.findById(customerId),
      this.repository.findChatsByCustomerId(customerId),
    ]);
    if (!customer) throw new BadResponse("Cliente não encontrado", 404);

    return chats.map((c) => ({
      ...c,
      customer_name: this.cryptoProvider.decrypt(c.customer_name),
    }));
  }

  public async getLaundryChats(customerId: string) {
    const [laundry, chats] = await Promise.all([
      this.laundryRepository.findById(customerId),
      this.repository.findChatsByLaundryId(customerId),
    ]);
    if (!laundry) throw new BadResponse("Lavanderia não encontrada", 404);

    return chats.map((c) => ({
      ...c,
      customer_name: this.cryptoProvider.decrypt(c.customer_name),
    }));
  }

  public async getChatById(chat_id: string) {
    const chat = await this.repository.findById(chat_id);
    if (!chat) {
      throw new BadResponse("Chat não encontrado.", 404);
    }

    return {
      ...chat,
      customer_name: this.cryptoProvider.decrypt(chat.customer_name)
    }
  }

  public async getMessagesWithChatId(chat_id: string) {
    const messages = await db
      .select()
      .from(chatMessage)
      .where(eq(chatMessage.chat_id, chat_id));
    if (messages.length == 0) {
      throw new BadResponse("Sem mensagens", 404);
    }
  }
}
