import { NotificationModel } from "@/types/models";

export interface INotificationRepository {
  save(
    data: Omit<NotificationModel, "id" | "created_at">
  ): Promise<NotificationModel>;
  delete(id: string): Promise<void>;
  findByUserId(
    userId: string,
    page?: number,
    pageSize?: number,
    status?: string
  ): Promise<NotificationModel[]>;
  deleteWithUserId(userId: string): Promise<void>;
  listNotifications(
    userId: string,
    userType: "customer" | "member",
    page?: number,
    pageSize?: number,
    status?: string
  ): Promise<NotificationModel[]>;
  updateNotification(
    notificationId: string,
    fields: Partial<Omit<NotificationModel, "id" | "created_at" | "userType">>
  ): Promise<void>;
  selectByUserIdAndStatus(
    userId: string,
    status: string
  ): Promise<NotificationModel[]>;
}