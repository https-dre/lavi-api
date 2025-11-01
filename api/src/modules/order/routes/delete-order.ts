import Elysia, { t } from "elysia";
import { OrderService } from "../order-service";

export const deleteOrder = (service: OrderService): Elysia => {
  return new Elysia().delete(
    "/orders/:id",
    async ({ params, status }) => {
      const { id } = params;
      await service.deleteOrder(id);
      return status(204);
    },
    {
      detail: {
        summary: "Delete order with id",
        tags: ["orders"],
      },
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
    },
  );
};
