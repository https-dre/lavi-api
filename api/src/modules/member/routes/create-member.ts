import Elysia, { t } from "elysia";
import { MemberService } from "../member-service";
import { zMember } from "@/types/typebox";

export const createMember = (service: MemberService): Elysia => {
  return new Elysia().post(
    "/members",
    async ({ body, status }) => {
      const { member } = body;
      const created = await service.createMember(member);
      return status(201, { member_id: created.id });
    },
    {
      detail: {
        summary: "Create member",
        description:
          'Create laundry member with custom roles. Allowed roles: "owner", "employee" ',
        tags: ["members"],
      },
      body: t.Object({
        member: t.Omit(zMember, ["id", "created_at"]),
      }),
      response: {
        201: t.Object({
          member_id: t.String(),
        }),
      },
    },
  );
};
