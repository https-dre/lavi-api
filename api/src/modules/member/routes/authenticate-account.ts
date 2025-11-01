import Elysia, { t } from "elysia";
import { MemberService } from "../member-service";

export const authenticateMember = (service: MemberService): Elysia => {
  return new Elysia().put(
    "/members/auth",
    async ({ body, status }) => {
      const { email, password } = body;
      const payload = await service.authenticateMember(email, password);
      return status(201, { token: payload });
    },
    {
      detail: {
        summary: "Authenticate member",
        tags: ["members"],
      },
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 8 }),
      }),
      response: {
        201: t.Object({
          token: t.String(),
        }),
      },
    },
  );
};
