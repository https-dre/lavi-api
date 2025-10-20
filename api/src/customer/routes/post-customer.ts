import Elysia, { t } from "elysia";
import { CustomerService } from "../customer-service";
import { CustomerType } from "../../shared/dto/typebox";
import { CustomerDTO } from "../../shared/dto";

export const postCustomer = (service: CustomerService) => {
  return new Elysia().post(
    "/customer",
    async ({ body, status }) => {
      const { customer } = body;
      type C = typeof CustomerType.static;
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
        customer: t.Omit(CustomerType, ["id", "created_at"]),
      }),
      response: {
        201: t.Object({
          customer_id: t.String({ format: "uuid" }),
        }),
      },
    },
  );
};
