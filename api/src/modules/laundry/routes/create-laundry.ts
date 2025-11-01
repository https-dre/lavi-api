import Elysia, { t } from "elysia";
import { LaundryService } from "../laundry-service";
import { LaundryType } from "@/types/typebox";

export const createLaundry = (service: LaundryService): Elysia => {
  return new Elysia().post(
    "/laundries",
    async ({ body, status }) => {
      const { laundry, ownerId } = body;
      const laundryId = await service.save(ownerId, laundry);
      return status(201, { laundryId });
    },
    {
      detail: {
        summary: "Create laundry",
        tags: ["laundries"],
      },
      body: t.Object({
        ownerId: t.String({ format: "uuid" }),
        laundry: t.Omit(LaundryType, ["created_at", "id", "putEmployeeCode"]),
      }),
      response: {
        201: t.Object({
          laundryId: t.String({ format: "uuid" }),
        }),
      },
    },
  );
};
