import Elysia, { t } from "elysia";
import { CustomerService } from "../customer-service";
import { CustomerType } from "../../shared/dto/typebox";

export const getCustomer = (service: CustomerService) => {
  return new Elysia().get(
    "/customer/:id",
    async ({ params, status }) => {
      const { id } = params;
      const customer = await service.getCustomerWithId(id);
      return status(200, { customer });
    },
    {
      // ROUTE SCHEME
      detail: {
        summary: "Get customer with id",
        tags: ["customer"],
      },
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      response: {
        200: t.Object({
          customer: t.Omit(CustomerType, ["password"]),
        }),
      },
    },
  );
};
