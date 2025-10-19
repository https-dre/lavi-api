import { OrderService } from "@/order/order-service";
import { OrderType } from "@/shared/dto/typebox";
import Elysia, { t } from "elysia";

export const listOrders = (orderService: OrderService): Elysia => {
  return new Elysia().get(
    "/laundries/:laundryId/orders",
    async ({ params, query, status }) => {
      const { laundryId } = params;
      const { page, pageSize } = query;
      const orders = await orderService.findByLaundryId(
        laundryId,
        page!,
        pageSize!,
      );
      return status(200, { orders });
    },
    {
      detail: {
        summary: "Get laundry orders",
        tags: ["laundries"],
      },
      query: t.Object({
        page: t.Optional(t.Number({ default: 1 })),
        pageSize: t.Optional(t.Number({ default: 10 })),
      }),
      params: t.Object({
        laundryId: t.String(),
      }),
      response: {
        200: t.Object({
          orders: t.Array(OrderType),
        }),
      },
    },
  );
};
