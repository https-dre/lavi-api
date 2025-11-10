import * as t from "@/infra/database/tables";

export type FeedbackWithImages = {
  feedbackPost: typeof t.feedbackPost.$inferSelect;
  feedbackImages: (typeof t.feedbackImage.$inferSelect)[];
  customerName: string;
  customerProfileUrl: string | null;
};
