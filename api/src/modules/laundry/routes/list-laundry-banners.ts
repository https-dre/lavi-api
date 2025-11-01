import { MediaService } from "@/media/media-service";
import { LaundryBannerType } from "@/types/typebox";
import Elysia, { t } from "elysia";

export const listLaundryBanners = (service: MediaService) => {
  return new Elysia().get('/laundries/:laundryId/banners', async ({ params, status }) => {
    const { laundryId } = params;
    const banners = await service.listLaundryBanners(laundryId);
    return status(200, { banners })
  },
    {
      detail: {
        summary: "List laundry banners",
        tags: ['laundries']
      },
      params: t.Object({
        laundryId: t.String({ format: "uuid" })
      }),
      response: {
        200: t.Object({
          banners: t.Array(LaundryBannerType)
        })
      }
    })
}