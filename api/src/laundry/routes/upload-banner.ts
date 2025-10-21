import { MediaService } from "@/media/media-service"
import Elysia, { t } from "elysia"

export const uploadLaundryBanner = (service: MediaService) => {
  return new Elysia().post('/laundries/:laundryId/banners', async ({ params, body, status }) => {
    const { laundryId } = params;
    const { file } = body;
    await service.uploadLaundryBanner(laundryId, await file.arrayBuffer(), file.type)
  },
    {
      detail: {
        summary: "Upload banner",
        tags: ["laundries"]
      },
      body: t.Object({
        file: t.File({ type: 'image/*' })
      }),
      params: t.Object({
        laundryId: t.String({ format: "uuid" })
      })
    }
  )
}