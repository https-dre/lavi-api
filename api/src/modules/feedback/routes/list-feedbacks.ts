import Elysia, { t } from "elysia";
import { FeedbackService } from "../feedback-service";
import { FeedbackImageType, FeedbackType } from "@/types/typebox";

export const listFeedbacksByLaundry = (service: FeedbackService) => {
  return new Elysia().get(
    "/feedbacks/:laundryId",
    async ({ params, query, status }) => {
      const { laundryId } = params;
      const { page, pageSize } = query;
      const feedbacks = await service.listFeedbacksByLaundryId(laundryId, page, pageSize);
      return status(200, { feedbacks })
    },
    {
      detail: {
        summary: "List laundry feedbacks",
        tags: ["feedbacks"],
      },
      params: t.Object({
        laundryId: t.String(),
      }),
      query: t.Optional(
        t.Object({
          page: t.Number({ default: 1 }),
          pageSize: t.Number({ default: 10 }),
        })
      ),
      response: {
        200: t.Object({
          feedbacks: t.Array(t.Object({
            feedbackPost: FeedbackType,
            feedbackImages: t.Array(FeedbackImageType),
            customerName: t.String(),
            customerProfileUrl: t.Union([t.Null(), t.String()])
          }))
        })
      }
    }
  );
};
