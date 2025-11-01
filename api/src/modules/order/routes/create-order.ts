import Elysia, { t } from "elysia";
import { OrderService } from "../order-service";
import { OrderItemType, OrderType } from "@/types/typebox";

export const createOrder = (service: OrderService): Elysia => {
  return new Elysia().post(
    "/orders",
    async ({ body, status }) => {
      const { order, items } = body;
      const result = await service.createOrder(order);
      await service.pushOrderItems(result.id, items);
      return status(201, { order: result });
    },
    {
      detail: {
        summary: "Create order",
        tags: ["orders"],
      },
      body: t.Object({
        order: t.Omit(OrderType, ["id", "created_at", "updated_at"]),
        items: t.Array(t.Omit(OrderItemType, ["id", "orderId"])),
      }),
      response: {
        201: t.Object({
          order: OrderType,
        }),
      },
    },
  );
};
