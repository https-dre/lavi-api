import { NotificationService } from "@/modules/notifications/notification-service";
import { NotificationType } from "@/types/typebox";
import Elysia, { t } from "elysia";

export const createNotificationForMember = (service: NotificationService) => {
  return new Elysia().post(
    "/members/:memberId/notifications",
    async ({ params, body, status }) => {
      const { memberId } = params;
      const { notification } = body;
      const created = await service.createCustomerNotification(
        memberId,
        notification
      );

      return status(201, { notification_created: created });
    },
    {
      detail: {
        summary: "Create notification",
        tags: ["customer"],
      },
      body: t.Object({
        notification: t.Omit(NotificationType, [
          "id",
          "created_at",
          "userType",
          "status",
          "userId",
        ]),
      }),
      response: {
        201: t.Object({
          notification_created: NotificationType,
        }),
      },
    }
  );
};
