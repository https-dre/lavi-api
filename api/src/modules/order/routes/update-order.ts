import Elysia, { t } from "elysia";
import { OrderService } from "../order-service";
import { OrderType } from "@/types/typebox";

export const updateOrder = (service: OrderService): Elysia => {
  return new Elysia().patch(
    "/orders/:id",
    async ({ params, body }) => {
      const { fields } = body;
      const { id } = params;
      await service.updateOrderFields(id, fields);
      return { details: "Pedido atualizado!" };
    },
    {
      detail: {
        summary: "Update order",
        tags: ["orders"],
      },
      body: t.Object({
        fields: t.Partial(
          t.Omit(OrderType, ["id", "created_at", "updated_at", "customerId"]),
        ),
      }),
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
    },
  );
};
