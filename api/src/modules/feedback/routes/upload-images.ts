import { MediaService } from "@/media/media-service";
import { FeedbackImageType } from "@/types/typebox";
import Elysia, { t } from "elysia";

export const uploadFeedbackImages = (service: MediaService) => {
  return new Elysia().post(
    "/feedbacks/:feedbackId",
    async ({ params, body, status }) => {
      const { feedbackId } = params;
      const { images } = body;
      const promise = images.map(async (img) => ({
        content: await img.arrayBuffer(),
        contentType: img.type,
      }));
      const filesReady = await Promise.all(promise);
      const filesUploaded = await service.uploadFeedbackImages(
        feedbackId,
        filesReady
      );
      return status(201, { message: "Uploaded!", images: filesUploaded });
    },
    {
      detail: {
        summary: "Upload feedback images",
        tags: ["feedbacks"],
      },
      body: t.Object({
        images: t.Files({ type: "image/*", maxItems: 5 }),
      }),
      response: {
        201: t.Object({
          message: t.String(),
          images: t.Array(FeedbackImageType),
        }),
      },
    }
  );
};
