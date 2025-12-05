import { NotificationService } from "@/modules/notifications/notification-service";
import { zNotification } from "@/types/typebox";
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
        tags: ["members"],
      },
      body: t.Object({
        notification: t.Omit(zNotification, [
          "id",
          "created_at",
          "userType",
          "userId",
        ]),
      }),
      response: {
        201: t.Object({
          notification_created: zNotification,
        }),
      },
    }
  );
};
