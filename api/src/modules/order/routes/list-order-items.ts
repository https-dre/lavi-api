import Elysia, { t } from "elysia";
import { OrderService } from "../order-service";
import { OrderItemType } from "@/types/typebox";

export const listOrderItems = (service: OrderService) => {
  return new Elysia().get(
    "/orders/:orderId/items",
    async ({ params, status }) => {
      const { orderId } = params;
      const items = await service.getOrderItems(orderId);
      return status(200, { items });
    },
    {
      detail: {
        summary: "Get order items",
        tags: ["orders"],
      },
      params: t.Object({
        orderId: t.String({ format: "uuid" }),
      }),
      response: {
        200: t.Object({
          items: t.Array(OrderItemType),
        }),
      },
    }
  );
};
