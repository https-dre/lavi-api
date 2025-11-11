import Elysia from "elysia";
import { listNotifications } from "./list-notifications";
import { appServices } from "@/generators";
import { setNotificationsAsUnRead } from "./set-as-unread";
import { getNotSentNotifications } from "./get-not-sent";
import { updateNotificationStatus } from "./update-notification-status";

const notificationController = new Elysia()
  .use(listNotifications(appServices.notificationService))
  .use(setNotificationsAsUnRead())
  .use(getNotSentNotifications(appServices.notificationService))
  .use(updateNotificationStatus(appServices.notificationService));

export { notificationController };
