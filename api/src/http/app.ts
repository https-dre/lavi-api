import { Elysia } from "elysia";
import { BadResponse } from "./error-handler";
import { openapi } from "@elysiajs/openapi";

import { memberController } from "@/member/routes";
import { customerController } from "../customer/routes";
import { laundryController } from "../laundry/routes";
import { orderController } from "@/order/routes";
import { catalogController } from "@/catalog-item/routes";

const App = new Elysia()
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
      default:
        console.log(error);
        return status(500, {
          details: "Internal server error",
          alert: "Contact the admin!",
          error,
        });
    }
  });

// Configura as rotas
App.get("/", ({ redirect }) => redirect("/openapi"));
App.get("ping", () => "Hello World!")
App.use(memberController);
App.use(customerController);
App.use(laundryController);
App.use(catalogController);
App.use(orderController);

type App_t = typeof App;

export { App, App_t }