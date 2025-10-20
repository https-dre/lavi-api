import Elysia, { t } from "elysia";
import { CustomerService } from "../customer-service";

export const deleteCustomer = (service: CustomerService) => {
  return new Elysia().delete(
    "/customer/:id",
    async ({ params, status }) => {
      const { id } = params;
      await service.deleteWithId(id);
      return status(200);
    },
    {
      detail: {
        summary: "Delete customer",
        tags: ["customer"],
      },
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
    },
  );
};
