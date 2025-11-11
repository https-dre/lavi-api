import { db } from "@/infra/database/conn";
import * as t from "@/infra/database/tables";
import { NotificationModel } from "@/types/models";
import { and, eq } from "drizzle-orm";

export const updateManyNotificationsByStatus = async (
  userId: string,
  status: string,
  fields: Partial<NotificationModel>
) => {
  await db
    .update(t.notifications)
    .set(fields)
    .where(
      and(
        eq(t.notifications.userId, userId),
        eq(t.notifications.status, status)
      )
    );
};
