import { db } from "@/infra/database/conn";
import { NotificationDTO } from "@/types/dtos";
import { INotificationRepository } from "@/types/repositories";
import * as t from "@/infra/database/tables";
import { randomUUIDv7 } from "bun";
import { and, desc, eq } from "drizzle-orm";

export class NotificationRepository implements INotificationRepository {
  public async save(
    data: Omit<NotificationDTO, "id" | "created_at">
  ): Promise<NotificationDTO> {
    const created = await db
      .insert(t.notifications)
      .values({
        ...data,
        id: randomUUIDv7(),
      })
      .returning();
    return created[0];
  }

  public async findByUserId(
    userId: string,
    page: number = 1,
    pageSize: number = 10,
    status?: string
  ): Promise<NotificationDTO[]> {
    const notifications = await db
      .select()
      .from(t.notifications)
      .where(
        status
          ? and(
              eq(t.notifications.userId, userId),
              eq(t.notifications.status, status)
            )
          : eq(t.notifications.userId, userId)
      )
      .orderBy(desc(t.notifications.created_at))
      .limit(pageSize)
      .offset((page - 1) * pageSize);
    return notifications;
  }

  public async delete(id: string): Promise<void> {
    await db.delete(t.notifications).where(eq(t.notifications.id, id));
  }

  public async deleteWithUserId(userId: string): Promise<void> {
    await db.delete(t.notifications).where(eq(t.notifications.userId, userId));
  }

  public async listNotifications(
    userId: string,
    userType: "customer" | "member",
    page: number = 1,
    pageSize: number = 10,
    status?: string
  ): Promise<NotificationDTO[]> {
    const result = await db
      .select()
      .from(t.notifications)
      .where(
        and(
          eq(t.notifications.userType, userType),
          eq(t.notifications.userId, userId),
          status ? eq(t.notifications.status, status) : undefined
        )
      )
      .orderBy(desc(t.notifications.created_at))
      .limit(pageSize)
      .offset((page - 1) * pageSize);
    return result;
  }

  public async updateNotification(
    notificationId: string,
    fields: Partial<Omit<NotificationDTO, "id" | "created_at" | "userType">>
  ): Promise<void> {
    await db
      .update(t.notifications)
      .set(fields)
      .where(eq(t.notifications.id, notificationId));
  }
}
