import { BadResponse } from "@/http/error-handler";
import { FeedbackDTO } from "@/shared/dto";
import {
  ICustomerRepository,
  IFeedbackRepository,
  ILaundryRepository,
} from "@/shared/repositories";

export class FeedbackService {
  constructor(
    private repository: IFeedbackRepository,
    private laundryRepository: ILaundryRepository,
    private customerRepository: ICustomerRepository
  ) {}

  async saveFeedback(
    data: Omit<FeedbackDTO, "id" | "created_at">
  ): Promise<FeedbackDTO> {
    if (!(await this.laundryRepository.findById(data.laundryId)))
      throw new BadResponse("Lavanderia não encontrada.", 404);
    if (!(await this.customerRepository.findById(data.customerId)))
      throw new BadResponse("Conta de cliente não encontrada.", 404);
    const created = await this.repository.save(data);
    return created;
  }

  async deleteFeedbackById(id: string): Promise<void> {
    if (!(await this.repository.findById(id)))
      throw new BadResponse("Registro do Feedback não encontrado.", 404);

    await this.repository.deleteById(id);
  }

  async listFeedbacksByLaundryId(
    laundryId: string,
    page: number = 1,
    pageSize: number = 10
  ) {
    const feedbacks = await this.repository.findWithInnerJoin(laundryId, page, pageSize);
    return feedbacks;
  }
}
