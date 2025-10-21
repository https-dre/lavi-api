import Elysia from "elysia";
import { createFeedback } from "./create-feedback";
import { appServices } from "@/shared/services";

const feedbackController = new Elysia()
  .use(createFeedback(appServices.feedbackService))

export { feedbackController }