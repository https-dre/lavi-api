import Elysia from "elysia";
import { createOrder } from "./create-order";
import { deleteOrder } from "./delete-order";
import { appServices } from "@/generators/";
import { pushOrderItems } from "./push-order-items";
import { updateOrder } from "./update-order";
import { listOrderItems } from "./list-order-items";

const orderController = new Elysia()
  .use(createOrder(appServices.order))
  .use(deleteOrder(appServices.order))
  .use(pushOrderItems(appServices.order))
  .use(updateOrder(appServices.order))
  .use(listOrderItems(appServices.order));

export { orderController };
