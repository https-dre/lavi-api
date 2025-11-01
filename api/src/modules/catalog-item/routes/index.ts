import Elysia from "elysia";
import { createCatalogItem } from "./create-catalog-item";
import { deleteCatalogItem } from "./delete-catalog-item";

import { appServices } from "@/generators";
import { getCatalogByLaundry } from "./get-catalog-by-laundry";
import { updateCatalogItem } from "./update-catalog-item";

const catalogController = new Elysia()
  .use(createCatalogItem(appServices.catalogService))
  .use(deleteCatalogItem(appServices.catalogService))
  .use(getCatalogByLaundry(appServices.catalogService))
  .use(updateCatalogItem(appServices.catalogService));

export { catalogController };
