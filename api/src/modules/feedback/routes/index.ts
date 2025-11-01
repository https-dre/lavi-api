import Elysia from "elysia";
import { createFeedback } from "./create-feedback";
import { appServices } from "@/generators/";
import { listFeedbacksByLaundry } from "./list-feedbacks";
import { uploadFeedbackImages } from "./upload-images";

const feedbackController = new Elysia()
  .use(createFeedback(appServices.feedbackService))
  .use(listFeedbacksByLaundry(appServices.feedbackService))
  .use(uploadFeedbackImages(appServices.mediaService));

export { feedbackController };
