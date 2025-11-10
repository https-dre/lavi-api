import { BadResponse } from "@/infra/http/error-handler";
import { NotificationDTO } from "@/types/dtos";
import {
  ICustomerRepository,
  IMemberRepository,
  INotificationRepository,
} from "@/types/repositories";

type NotificationNotCreated_t = Omit<
  NotificationDTO,
  "id" | "created_at" | "userType" | "status" | "userId"
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
      userId: memberId
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
      userId: customerId
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

  private async validateUser(userId: string, type: string) {
    if (type == "customer") {
      if (!(await this.customerRepository.findById(userId)))
        throw new BadResponse("Cliente não encontrado.", 404);

      return;
    }

    if (!(await this.memberRepository.findById(userId)))
      throw new BadResponse("Membro não encontrado.", 404);
  }

  public async listNotifications(
    userId: string,
    userType: "customer" | "member",
    page: number = 1,
    pageSize: number = 10,
    status?: string,
  ) {
    await this.validateUser(userId, userType);
    const notifications = await this.repository.listNotifications(
      userId,
      userType,
      page,
      pageSize,
      status,
    );
    return notifications;
  }
}
