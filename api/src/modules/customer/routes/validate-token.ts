import Elysia, { t } from "elysia";
import { CustomerService } from "../customer-service";

export const validateCustomerJWT = (service: CustomerService) => {
  return new Elysia().patch(
    "/customers/auth",
    async ({ body, status }) => {
      const { token } = body;
      const payload = await service.checkAuth(token);
      return status(200, { payload: { customerId: payload.id } });
    },
    {
      detail: {
        summary: "Validate JWT",
        tags: ["customer"],
      },
      body: t.Object({
        token: t.String(),
      }),
      response: {
        200: t.Object({
          payload: t.Object({
            customerId: t.String(),
          }),
        }),
      },
    },
  );
};
