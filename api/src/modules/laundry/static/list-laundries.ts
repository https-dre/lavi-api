import { db } from "@/infra/database/conn"
import { feedbackPost, laundry } from "@/infra/database/tables"
import { avg, count, eq, getTableColumns } from "drizzle-orm"

const { cnpj_blind_index, ...publicLaundryFields } = getTableColumns(laundry);

export const getAllLaundries = async () => {
  const result = await db
    .select({
      ...publicLaundryFields,
      reviewsCount: count(feedbackPost.id),
      averageRating: avg(feedbackPost.rate)
    })
    .from(laundry)
    .leftJoin(feedbackPost, eq(laundry.id, feedbackPost.laundryId))
    .groupBy(laundry.id)
  return result;
}