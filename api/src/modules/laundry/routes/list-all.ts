import Elysia, { t } from "elysia";
import { LaundryService } from "../laundry-service";
import { LaundryType } from "@/types/typebox";

export const listLaundries = (service: LaundryService) => {
  return new Elysia().get(
    "/public/laundries",
    async ({ status }) => {
      const laundries = await service.listLaundries();
      return status(200, { laundries });
    },
    {
      detail: {
        summary: "List laundries",
        tags: ["laundries"],
      },
      body: t.Object({
        laundries: t.Array(LaundryType),
      }),
    }
  );
};
