import { MemberType } from "@/types/typebox";
import { MemberService } from "../member-service";
import Elysia, { t } from "elysia";

export const createOwnerMember = (service: MemberService): Elysia => {
  return new Elysia().post(
    "/members/owners",
    async ({ body, status }) => {
      const { member } = body;
      const created = await service.createOwnerMember(member);
      return status(201, { member_id: created.id });
    },
    {
      detail: {
        summary: "Create owner",
        tags: ["members"],
      },
      body: t.Object({
        member: t.Omit(MemberType, ["id", "created_at", "roles"]),
      }),
      response: {
        201: t.Object({
          member_id: t.String({ format: "uuid" }),
        }),
      },
    },
  );
};
