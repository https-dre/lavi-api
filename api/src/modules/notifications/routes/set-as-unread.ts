import Elysia, { t } from "elysia";
import { updateManyNotificationsByStatus } from "../static/update-many-by-status";
import { NotificationStatus } from "@/types/notification-data";

export const setNotificationsAsUnRead = () => {
  return new Elysia().patch(
    "/notifications/:userId",
    async ({ params, status }) => {
      const { userId } = params;
      await updateManyNotificationsByStatus(
        userId,
        NotificationStatus.NOT_SENT,
        {
          status: NotificationStatus.UNREAD,
        }
      );

      return status(204, "Notifications updated!");
    },
    {
      detail: {
        summary: "Set notifications as Unread",
        tags: ["notifications"],
      },
      params: t.Object({
        userId: t.String({
          format: "uuid",
          description: "The id of customer or id of member",
        }),
      }),
      response: {
        204: t.String(),
      },
    }
  );
};
