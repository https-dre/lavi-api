import { CustomerType } from "../../shared/dto/typebox";
import { CustomerService } from "../customer-service";
import Elysia, { t } from "elysia";

export const updateCustomer = (service: CustomerService) => {
  return new Elysia().patch(
    "/customer/:id",
    async ({ body, params, status }) => {
      const { fields } = body;
      const { id } = params;
      await service.updateCustomer(id, fields);
      return status(200);
    },
    {
      detail: {
        summary: "Update customer fields",
        tags: ["customer"],
      },
      body: t.Object({
        fields: t.Partial(
          t.Omit(CustomerType, ["password", "id", "created_at"]),
        ),
      }),
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
    },
  );
};
