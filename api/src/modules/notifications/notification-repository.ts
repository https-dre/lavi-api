import { db } from "@/infra/database/conn";
import { NotificationDTO } from "@/types/dtos";
import { INotificationRepository } from "@/types/repositories";
import * as t from "@/infra/database/tables";
import { randomUUIDv7 } from "bun";
import { and, eq } from "drizzle-orm";

export class NotificationRepository implements INotificationRepository {
  public async save(
    data: Omit<NotificationDTO, "id" | "created_at">,
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

  public async findByUserId(userId: string): Promise<NotificationDTO[]> {
    const notifications = await db
      .select()
      .from(t.notifications)
      .where(eq(t.notifications.userId, userId));
    return notifications;
  }

  public async delete(id: string): Promise<void> {
    await db.delete(t.notifications).where(eq(t.notifications.id, id));
  }

  public async deleteWithUserId(userId: string): Promise<void> {
    await db.delete(t.notifications).where(eq(t.notifications.userId, userId));
  }

  public async listCustomerNotifications(
    customerId: string,
  ): Promise<NotificationDTO[]> {
    const result = await db
      .select()
      .from(t.notifications)
      .where(
        and(
          eq(t.notifications.userType, "customer"),
          eq(t.notifications.userId, customerId),
        ),
      );
    return result;
  }

  public async listMemberNotifications(
    memberId: string,
  ): Promise<NotificationDTO[]> {
    return await db
      .select()
      .from(t.notifications)
      .where(
        and(
          eq(t.notifications.userType, "customer"),
          eq(t.notifications.userId, memberId),
        ),
      );
  }

  public async updateNotification(
    notificationId: string,
    fields: Partial<Omit<NotificationDTO, "id" | "created_at" | "userType">>,
  ): Promise<void> {
    await db
      .update(t.notifications)
      .set(fields)
      .where(eq(t.notifications.id, notificationId));
  }
}
