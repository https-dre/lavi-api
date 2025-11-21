import { BadResponse } from "@/infra/http/error-handler";
import { ChatModel } from "@/types/models";
import {
  ICustomerRepository,
  ILaundryRepository,
  IMemberRepository,
} from "@/types/repositories";
import { IChatRepository } from "@/types/repositories/interfaces/chat";

export class ChatService {
  constructor(
    private repository: IChatRepository,
    private customerRepository: ICustomerRepository,
    private laundryRepository: ILaundryRepository,
    private memberRepository: IMemberRepository
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
    if(!customer) 
      throw new BadResponse("Cliente não encontrado", 404);

    return chats;
  }

    public async getLaundryChats(customerId: string) {
    const [laundry, chats] = await Promise.all([
      this.laundryRepository.findById(customerId),
      this.repository.findChatsByCustomerId(customerId),
    ]);
    if(!laundry) 
      throw new BadResponse("Lavanderia não encontrada", 404);

    return chats;
  }
}
