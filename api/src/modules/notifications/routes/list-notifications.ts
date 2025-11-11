import Elysia, { t } from "elysia";
import { NotificationService } from "../notification-service";
import { NotificationType } from "@/types/typebox";

export const listNotifications = (service: NotificationService) => {
  return new Elysia().get(
    "/notifications/:userId",
    async ({ query, params, status }) => {
      const { userId } = params;
      const { page, pageSize, statusFilter } = query;
      const notifications = await service.getRecentNotifications(
        userId,
        page,
        pageSize,
        statusFilter
      );
      return status(200, { notifications });
    },
    {
      detail: {
        summary: "List notifications",
        description: "Receive the latest notifications.",
        tags: ["notifications"],
      },
      params: t.Object({
        userId: t.String({ format: "uuid" }),
      }),
      query: t.Object({
        page: t.Optional(t.Number({ default: 1 })),
        pageSize: t.Optional(t.Number({ default: 10 })),
        statusFilter: t.Optional(t.String()),
      }),
      response: {
        200: t.Object({
          notifications: t.Array(NotificationType),
        }),
      },
    }
  );
};
