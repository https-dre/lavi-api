import Elysia, { t } from "elysia";
import { MediaService } from "@/media/media-service";

export const uploadCustomerProfileImage = (service: MediaService) => {
  return new Elysia().patch(
    "/customers/profile-image/:customerId",
    async ({ params, body, status }) => {
      const { customerId } = params;
      const { file } = body;
      await service.uploadCustomerProfileImage(
        customerId,
        await file.arrayBuffer(),
        file.type,
      );
      return status(201, { message: "Image uploaded" });
    },
    {
      detail: {
        summary: "Upload profile image",
        tags: ["customer"],
      },
      body: t.Object({
        file: t.File({ type: "image/*" }),
      }),
      params: t.Object({
        customerId: t.String({ format: "uuid" }),
      }),
    },
  );
};
