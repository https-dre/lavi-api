import Elysia, { t } from "elysia";
import { LaundryService } from "../laundry-service";

export const deleteLaundry = (service: LaundryService): Elysia => {
  return new Elysia().delete(
    "/laundries/:id",
    async ({ params, status }) => {
      const { id } = params;
      await service.deleteWithId(id);
      return status(200);
    },
    {
      detail: {
        summary: "Delete laundry with Id",
        tags: ["laundries"],
      },
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
    },
  );
};
