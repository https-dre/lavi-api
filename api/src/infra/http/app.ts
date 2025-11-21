import { Elysia } from "elysia";
import { BadResponse } from "./error-handler";
import { openapi } from "@elysiajs/openapi";

import { memberController } from "@/modules/member/routes";
import { customerController } from "@/modules/customer/routes";
import { laundryController } from "@/modules/laundry/routes";
import { orderController } from "@/modules/order/routes";
import { catalogController } from "@/modules/catalog-item/routes";
import { s3Api } from "./s3-api";
import { feedbackController } from "@/modules/feedback/routes";
import { notificationController } from "@/modules/notifications/routes";
import { chatController } from "@/modules/chat/routes";

export const App = new Elysia()
  .use(
    openapi({
      documentation: {
        info: {
          title: "Laví API - Docs",
          version: "v2.0.0",
        },
      },
      scalar: {
        url: "/openapi/json",
      },
    })
  )
  .error({
    BadResponse,
  })
  .onError(({ code, error, status }) => {
    switch (code) {
      case "BadResponse":
        return status(error.status, error.response);
      case "VALIDATION":
        return status(400, { error });
      case "INVALID_FILE_TYPE":
        return status(400, { details: "Invalid File Type", error });
      default:
        return status(500, {
          details: "Internal server error",
          alert: "Contact the admin!",
          error,
        });
    }
  })
  .get("/", ({ redirect }) => redirect("/openapi"))
  .get("/ping", () => "Hello World!")
  .use(memberController)
  .use(customerController)
  .use(laundryController)
  .use(catalogController)
  .use(orderController)
  .use(feedbackController)
  .use(notificationController)
  .use(chatController)
  .use(s3Api);
