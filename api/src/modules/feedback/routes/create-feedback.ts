import Elysia, { t } from "elysia";
import { FeedbackService } from "../feedback-service";
import { zFeedback } from "@/types/typebox";

export const createFeedback = (service: FeedbackService) => {
  return new Elysia().post('/feedbacks/',
    async ({ body, status }) => {
      const { feedback, rate } = body;
      const created = await service.saveFeedback({ ...feedback, rate })
      return status(201, { feedback_created: created })
    },
    {
      detail: {
        summary: "Create feedback",
        tags: ['feedbacks']
      },
      body: t.Object({
        feedback: t.Omit(zFeedback, ['id', 'created_at', 'rate']),
        rate: t.Number({ maximum: 5 })
      }),
      response: {
        201: t.Object({
          feedback_created: zFeedback
        })
      }
    })
}