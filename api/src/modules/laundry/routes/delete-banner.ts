import { MediaService } from "@/media/media-service";
import Elysia, { t } from "elysia";

export const deleteLaundryBanner = (service: MediaService) => {
  return new Elysia().delete('/laundry-banners/:bannerId', async ({ params, status }) => {
    const { bannerId } = params;
    await service.deleteLaundryBanner(bannerId);
    return status(200, { message: "Banner deletado" })
  },
    {
      detail: {
        summary: "Delete banner",
        tags: ['laundries']
      },
      params: t.Object({
        bannerId: t.String({ format: "uuid" })
      })
    }
  )
}