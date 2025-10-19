import Elysia from "elysia";
import { createLaundry } from "./create-laundry";
import { deleteLaundry } from "./delete-laundry";
import { getLaundry } from "./get-laundry";
import { searchLaundriesByName } from "./search-by-name";
import { appServices } from "../../shared/services";
import { listOrders } from "./list-orders";

const laundryController = new Elysia()
  .use(createLaundry(appServices.laundry))
  .use(deleteLaundry(appServices.laundry))
  .use(getLaundry(appServices.laundry))
  .use(searchLaundriesByName(appServices.laundry))
  .use(listOrders(appServices.order));

export { laundryController };
