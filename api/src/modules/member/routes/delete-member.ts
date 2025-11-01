import Elysia, { t } from "elysia";
import { MemberService } from "../member-service";

export const deleteMember = (service: MemberService): Elysia => {
  return new Elysia().delete(
    "/members/:id",
    async ({ params, status }) => {
      const { id } = params;
      await service.deleteMember(id);
      return status(204);
    },
    {
      detail: {
        summary: "Delete member with id",
        tags: ["members"],
      },
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
    },
  );
};
