import { LaundryService } from "@/laundry/laundry-service";
import Elysia, { t } from "elysia";

export const getLaundriesByMember = (
  laundryService: LaundryService,
): Elysia => {
  return new Elysia().get(
    "/members/:memberId/laundries",
    async ({ params, status }) => {
      const { memberId } = params;
      const laundries = await laundryService.findByMemberId(memberId);
      if (laundries.length > 0) {
        const result = laundries.map((l) => {
          const { id, name, profile_url } = l;
          return { id, name, profile_url };
        });
        return status(200, { laundries: result });
      }

      return status(404, { message: "Nenhuma associação com lavanderia." });
    },
    {
      detail: {
        summary: "List member laundries",
        tags: ["members"],
      },
      params: t.Object({
        memberId: t.String({ format: "uuid" }),
      }),
      response: {
        200: t.Object({
          laundries: t.Array(
            t.Object({
              id: t.String(),
              name: t.String(),
              profile_url: t.Union([t.String(), t.Null()]),
            }),
          ),
        }),
        404: t.Object({
          message: t.String({
            examples: ["Nenhuma associação com lavanderia"],
          }),
        }),
      },
    },
  );
};
