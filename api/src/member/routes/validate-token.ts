import Elysia, { t } from "elysia";
import { MemberService } from "../member-service";

export const validateAuthToken = (service: MemberService) => {
  return new Elysia().patch(
    "/members/auth",
    async ({ body, status }) => {
      const { token } = body;
      const payload = await service.checkJwt(token);
      return status(200, { payload });
    },
    {
      detail: {
        summary: "Validate JWT Token",
        tags: ["members"],
      },
      body: t.Object({
        token: t.String(),
      }),
      response: {
        200: t.Object({
          payload: t.Object({
            memberId: t.String(),
            roles: t.Array(t.String()),
          }),
        }),
      },
    },
  );
};
