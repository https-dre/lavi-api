import Elysia, { t } from "elysia";
import { CatalogItemService } from "../catalog-item.service";

export const deleteCatalogItem = (service: CatalogItemService): Elysia => {
  return new Elysia().delete('/catalogs/items/:itemId',
    async ({ params, status }) => {
      const { itemId } = params;
      await service.deleteItem(itemId);
      return status(204)
    }, {
    detail: {
      summary: "Delete catalog item",
      tags: ["catalog"]
    },
    params: t.Object({
      itemId: t.String({ format: "uuid" })
    })
  })
}