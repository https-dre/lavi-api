import Elysia, { t } from "elysia";
import { CustomerService } from "../customer-service";

export const listCustomers = (service: CustomerService) => {
  return new Elysia().get(
    "/public/customers",
    async ({ status }) => {
      const result = await service.listAllIds();
      return status(200, { ids: result.map((e) => e.id) });
    },
    {
      detail: {
        summary: "List customers",
        tags: ["customer"],
      },
      response: {
        200: t.Object({
          ids: t.Array(t.String({ format: "uuid" })),
        }),
      },
    },
  );
};
