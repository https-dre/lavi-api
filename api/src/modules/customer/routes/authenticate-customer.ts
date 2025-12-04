import Elysia, { t } from "elysia";
import { CustomerService } from "../customer-service";
import { zCustomer } from "@/types/typebox";

export const authenticateCustomer = (service: CustomerService) => {
  return new Elysia().put(
    "/customer/sign",
    async ({ body, status }) => {
      const { email, password } = body;
      const payload = await service.authCustomer(email, password);
      return status(201, payload);
    },
    {
      detail: {
        summary: "Authenticate customer",
        tags: ["customer"],
      },
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String(),
      }),
      response: {
        201: t.Object({
          token: t.String(),
          customer: zCustomer
        }),
      },
    },
  );
};
