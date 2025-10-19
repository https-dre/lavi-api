import Elysia, { t } from "elysia";
import { LaundryService } from "../laundry-service";
import { LaundryType } from "../../shared/dto/typebox";

export const updateLaundry = (service: LaundryService): Elysia => {
  return new Elysia().put(
    "/laundries/:id",
    async ({ params, body, status }) => {
      const { id } = params;
      const { fields } = body;
      await service.updateLaundryFields(id, fields);
      return status(200);
    },
    {
      detail: {
        summary: "Update laundry fields",
        tags: ["laundries"],
      },
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      body: t.Object({
        fields: t.Partial(
          t.Omit(LaundryType, ["id", "created_at", "putEmployeeCode"]),
        ),
      }),
    },
  );
};
