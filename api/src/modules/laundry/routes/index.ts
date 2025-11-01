import Elysia from "elysia";
import { createLaundry } from "./create-laundry";
import { deleteLaundry } from "./delete-laundry";
import { getLaundry } from "./get-laundry";
import { searchLaundriesByName } from "./search-by-name";
import { appServices } from "@/generators/index";
import { listOrders } from "./list-orders";
import { updateLaundry } from "./update-laundry";
import { uploadLaundryProfileImage } from "./upload-laundry-image";
import { listLaundryBanners } from "./list-laundry-banners";
import { uploadLaundryBanner } from "./upload-banner";
import { deleteLaundryBanner } from "./delete-banner";

const laundryController = new Elysia()
  .use(createLaundry(appServices.laundry))
  .use(deleteLaundry(appServices.laundry))
  .use(updateLaundry(appServices.laundry))
  .use(getLaundry(appServices.laundry))
  .use(searchLaundriesByName(appServices.laundry))
  .use(listOrders(appServices.order))
  .use(uploadLaundryProfileImage(appServices.mediaService))
  .use(listLaundryBanners(appServices.mediaService))
  .use(uploadLaundryBanner(appServices.mediaService))
  .use(deleteLaundryBanner(appServices.mediaService));

export { laundryController };
