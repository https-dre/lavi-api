import Elysia, { t } from "elysia";
import { OrderService } from "../order-service";
import { OrderItemType } from "@/types/typebox";

export const pushOrderItems = (service: OrderService): Elysia => {
  return new Elysia().post(
    "/orders/:id/items",
    async ({ params, body, status }) => {
      const { items } = body;
      const items_created = await service.pushOrderItems(params.id, items);
      return status(201, { items_created });
    },
    {
      detail: {
        summary: "Push order items",
        tags: ["orders"],
      },
      body: t.Object({
        items: t.Array(t.Omit(OrderItemType, ["id", "orderId"])),
      }),
      params: t.Object({
        id: t.String()
      }),
      response: {
        201: t.Object({
          items_created: t.Array(OrderItemType),
        }),
      },
    }
  );
};
