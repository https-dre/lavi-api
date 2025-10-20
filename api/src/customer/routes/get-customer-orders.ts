import Elysia, { t } from "elysia";
import { OrderService } from "../../order/order-service";
import { CustomerService } from "../customer-service";
import { OrderType } from "../../shared/dto/typebox";

export const getCustomerOrders = (
  customerService: CustomerService,
  orderService: OrderService,
) => {
  return new Elysia().get(
    "/customers/:id/orders",
    async ({ params, status }) => {
      const { id } = params;
      const customer = await customerService.getCustomerWithId(id);
      if (!customer) return status(404, { message: "Cliente não registrado" });

      const orders = await orderService.getOrdersByCustomerId(id);
      return status(200, { orders });
    },
    {
      detail: {
        summary: "Get customer orders",
        tags: ["customer"],
      },
      params: t.Object({
        id: t.String({ format: "uuid", description: "The customer id" }),
      }),
      response: {
        200: t.Object({
          orders: t.Array(OrderType),
        }),
        404: t.Object({
          message: t.String({ default: "Cliente não registrado" }),
        }),
      },
    },
  );
};
