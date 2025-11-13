import { db } from "@/infra/database/conn";
import * as t from "@/infra/database/tables";
import { avg, eq } from "drizzle-orm";

export const getAverageRating = async (laundryId: string) => {
  const result = await db
    .select({ averageRating: avg(t.feedbackPost.rate) })
    .from(t.feedbackPost)
    .where(eq(t.feedbackPost.laundryId, laundryId));

  const average = result[0]?.averageRating
    ? parseFloat(result[0].averageRating)
    : null;
  return average;
};
