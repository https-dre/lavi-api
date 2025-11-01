import { MediaService } from "@/media/media-service";
import Elysia, { t } from "elysia";

export const uploadLaundryProfileImage = (service: MediaService) => {
  return new Elysia().patch("/laundries/profile-image/:laundryId",
    async ({ params, body, status }) => {
      const { laundryId } = params;
      const { file } = body;
      await service.uploadLaundryProfileImage(laundryId, await file.arrayBuffer(), file.type)
      return status(201, { message: "Image uploaded!" })
    }, {
    detail: {
      summary: "Upload laundry image",
      tags: ["laundries"]
    },
    body: t.Object({
      file: t.File({ type: "image/*" })
    }),
    params: t.Object({
      laundryId: t.String({ format: "uuid" })
    })
  })
}