import Elysia, { t } from "elysia";
import { CatalogItemService } from "../catalog-item.service";
import { zCatalogItem } from "@/types/typebox";

export const getCatalogByLaundry = (service: CatalogItemService): Elysia => {
  return new Elysia().get(
    "/catalogs/:laundryId",
    async ({ params, status }) => {
      const { laundryId } = params;
      const items = await service.findByLaundryId(laundryId);
      return status(200, { catalog: { items }, laundryId });
    },
    {
      detail: {
        summary: "Get catalog by laundry id",
        tags: ["catalog"],
      },
      params: t.Object({
        laundryId: t.String({ format: "uuid" }),
      }),
      response: {
        200: t.Object({
          catalog: t.Object({
            items: t.Array(zCatalogItem),
          }),
          laundryId: t.String({ format: "uuid" }),
        }),
      },
    }
  );
};
