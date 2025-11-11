import Elysia, { t } from "elysia";
import { NotificationService } from "../notification-service";

export const updateNotificationStatus = (service: NotificationService) => {
  return new Elysia().patch(
    "/notifications/read/:id",
    async ({ params, body, status }) => {
      const { id } = params;
      const { new_status } = body;
      await service.updateNotificationStatus(id, new_status);
      return status(204);
    },
    {
      detail: {
        summary: "Update notification status",
        tags: ["notifications"],
      },
      body: t.Object({
        new_status: t.Union([
          t.Literal("not-sent"),
          t.Literal("unread"),
          t.Literal("readed"),
        ]),
      }),
    }
  );
};
