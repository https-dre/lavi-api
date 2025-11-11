import Elysia from "elysia";
import { listNotifications } from "./list-notifications";
import { appServices } from "@/generators";

const notificationController = new Elysia().use(
  listNotifications(appServices.notificationService)
);

export { notificationController };
