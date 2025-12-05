import { zMember } from "@/types/typebox";
import { MemberService } from "../member-service";
import Elysia, { t } from "elysia";

export const createEmployeeMember = (service: MemberService): Elysia => {
  return new Elysia().post(
    "/members/employees",
    async ({ body, status }) => {
      const { member, laundryId } = body;
      const created = await service.createEmployeeMember(member, laundryId);
      return status(201, { member_id: created.id });
    },
    {
      detail: {
        summary: "Create employee",
        tags: ["members"],
      },
      body: t.Object({
        member: t.Omit(zMember, ["id", "created_at", "roles"]),
        laundryId: t.String({ format: "uuid" }),
      }),
      response: {
        201: t.Object({
          member_id: t.String({ format: "uuid" }),
        }),
      },
    },
  );
};
