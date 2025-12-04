import Elysia, { t } from "elysia";
import { MemberService } from "../member-service";
import { zMember } from "@/types/typebox";

export const listMembers = (service: MemberService): Elysia => {
  return new Elysia().get(
    "/public/members",
    async () => {
      const members = await service.listAllMembers();
      return { members };
    },
    {
      detail: {
        summary: "List members",
        tags: ["members"],
      },
      response: {
        200: t.Object({
          members: t.Array(t.Omit(zMember, ["password"])),
        }),
      },
    },
  );
};
