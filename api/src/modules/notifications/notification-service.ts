import { BadResponse } from "@/infra/http/error-handler";
import { NotificationDTO } from "@/types/dtos";
import {
  ICustomerRepository,
  IMemberRepository,
  INotificationRepository,
} from "@/types/repositories";

type NotificationNotCreated_t = Omit<
  NotificationDTO,
  "id" | "created_at" | "userType" | "status"
>;

enum notificationStatus {
  UNREAD = "unread",
  SENT = "sent",
  READED = "readed",
}

export class NotificationService {
  constructor(
    private repository: INotificationRepository,
    private memberRepository: IMemberRepository,
    private customerRepository: ICustomerRepository,
  ) {}

  public async createMemberNotification(
    memberId: string,
    data: NotificationNotCreated_t,
  ) {
    if (!(await this.memberRepository.findById(memberId)))
      throw new BadResponse("Membro não encontrado.", 404);

    const created = await this.repository.save({
      ...data,
      userType: "member",
      status: "unread",
    });
    return created;
  }

  public async createCustomerNotification(
    customerId: string,
    data: NotificationNotCreated_t,
  ) {
    if (!(await this.customerRepository.findById(customerId)))
      throw new BadResponse("Cliente não encontrado", 404);

    const created = await this.repository.save({
      ...data,
      userType: "customer",
      status: "unread",
    });
    return created;
  }

  public async updateNotificationStatus(
    notificationId: string,
    status: notificationStatus,
  ) {
    await this.repository.updateNotification(notificationId, { status });
  }

  public async deleteUserNotifications(userId: string) {
    await this.repository.deleteWithUserId(userId);
  }
}
