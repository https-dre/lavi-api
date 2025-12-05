import Elysia, { t } from "elysia";
import { NotificationService } from "../notification-service";
import { zNotification } from "@/types/typebox";

export const getNotSentNotifications = (service: NotificationService) => {
  return new Elysia().get(
    "/notifications/:userId/not-sent",
    async ({ params, status }) => {
      const { userId } = params;
      const notifications = await service.getNotSentNotifications(userId);
      return status(200, { notifications });
    },
    {
      detail: {
        summary: "Get not sent notifications",
        tags: ["notifications"],
      },
      params: t.Object({
        userId: t.String({ format: "uuid" }),
      }),
      response: {
        200: t.Object({
          notifications: t.Array(zNotification),
        }),
      },
    }
  );
};
