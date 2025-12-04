import Elysia, { t } from "elysia";
import { CustomerService } from "../customer-service";
import { zCustomer } from "@/types/typebox";
import { CustomerDTO } from "@/types/dtos";

export const postCustomer = (service: CustomerService) => {
  return new Elysia().post(
    "/customer",
    async ({ body, status }) => {
      const { customer } = body;
      type C = typeof zCustomer.static;
      const id = await service.createCustomer(customer);
      return status(201, { customer_id: id });
    },
    {
      // ROUTE SCHEME
      detail: {
        summary: "Create customer",
        tags: ["customer"],
      },
      body: t.Object({
        customer: t.Omit(zCustomer, ["id", "created_at"]),
      }),
      response: {
        201: t.Object({
          customer_id: t.String({ format: "uuid" }),
        }),
      },
    },
  );
};
