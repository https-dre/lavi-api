import Elysia, { t } from "elysia";
import { CatalogItemService } from "../catalog-item.service";
import { zCatalogItem } from "@/types/typebox";

export const updateCatalogItem = (service: CatalogItemService): Elysia => {
  return new Elysia().patch(
    "/catalogs/:itemId",
    ({ params, body, status }) => {},
    {
      detail: {
        summary: "Update catalog item",
        tags: ["catalog"],
      },
      params: t.Object({
        itemId: t.String({ format: "uuid" }),
      }),
      body: t.Object({
        fields: t.Partial(t.Omit(zCatalogItem, ["id", "laundryId"])),
      }),
    },
  );
};
