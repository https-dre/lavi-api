import Elysia, { t } from "elysia";
import { LaundryService } from "../laundry-service";
import { zLaundry } from "@/types/typebox";

export const searchLaundriesByName = (service: LaundryService): Elysia => {
  return new Elysia().get(
    "/laundries/search/:name",
    async ({ params, status }) => {
      const { name } = params;
      const laundries = await service.searchByName(name);
      return status(200, { laundries });
    },
    {
      detail: {
        summary: "Search laundries by name",
        tags: ["laundries"],
        description:
          "Envie o parâmetro 'name' vazio para listar todas as lavanderias.",
      },
      params: t.Object({
        name: t.Optional(t.String()),
      }),
      response: {
        200: t.Object({
          laundries: t.Array(zLaundry),
        }),
      },
    },
  );
};
