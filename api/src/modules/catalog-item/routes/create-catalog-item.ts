import Elysia, { t } from "elysia";
import { CatalogItemService } from "../catalog-item.service";
import { zCatalogItem } from "@/types/typebox";

export const createCatalogItem = (service: CatalogItemService) => {
  return new Elysia().post(
    "/catalogs/:laundryId/items",
    async ({ body, params, status }) => {
      const { item } = body;
      const { laundryId } = params;
      const created = await service.createItem(laundryId, item);
      return status(201, { item: created });
    },
    {
      detail: {
        tags: ["catalog"],
        summary: "Create catalog item",
      },
      body: t.Object({
        item: t.Omit(zCatalogItem, ["id", "laundryId"]),
      }),
      params: t.Object({
        laundryId: t.String({ format: "uuid" }),
      }),
      response: {
        201: t.Object({
          item: zCatalogItem,
        }),
      },
    },
  );
};
