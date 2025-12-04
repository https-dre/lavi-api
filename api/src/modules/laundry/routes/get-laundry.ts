import Elysia, { t } from "elysia";
import { LaundryService } from "../laundry-service";
import { zLaundry } from "@/types/typebox";

export const getLaundry = (service: LaundryService): Elysia => {
  return new Elysia().get(
    "/public/laundries/:id",
    async ({ params, status }) => {
      const { id } = params;
      const result = await service.find(id);
      return status(200, { laundry: result });
    },
    {
      detail: {
        summary: "Get laundry with Id",
        tags: ["laundries"],
      },
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      response: {
        200: t.Object({
          laundry: zLaundry,
        }),
      },
    },
  );
};
