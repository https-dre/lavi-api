import { db } from "@/infra/database/conn";
import * as t from "@/infra/database/tables";
import { FeedbackImageModel, FeedbackModel } from "@/types/models";
import { IFeedbackRepository } from "@/types/repositories";
import { randomUUIDv7 } from "bun";
import { eq } from "drizzle-orm";

type FeedbackWithImages = {
  feedbackPost: typeof t.feedbackPost.$inferSelect;
  feedbackImages: typeof t.feedbackImage.$inferSelect[];
  customerName: string;
  customerProfileUrl: string | null;
}

export class FeedbackRepository implements IFeedbackRepository {
  async findWithInnerJoin(
    laundryId: string,
    page: number = 1,
    pageSize: number = 10
  ) { 

    const result = await db
      .select({
        post: t.feedbackPost,
        image: t.feedbackImage,
        customerName: t.customer.name, 
        customerProfileUrl: t.customer.profile_url
      })
      .from(t.feedbackPost)
      .where(eq(t.feedbackPost.laundryId, laundryId))
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .leftJoin(t.feedbackImage, eq(t.feedbackPost.id, t.feedbackImage.postId))
      .leftJoin(t.customer, eq(t.feedbackPost.customerId, t.customer.id));


    const groupedResults: Record<string, FeedbackWithImages> = {};

    for (const row of result) {
      const postId = row.post.id;

      if (!groupedResults[postId]) {
        groupedResults[postId] = {
          feedbackPost: row.post,
          customerName: row.customerName!, 
          customerProfileUrl: row.customerProfileUrl,
          feedbackImages: []
        };
      }
      if (row.image) {
        groupedResults[postId].feedbackImages.push(row.image);
      }
    }

    return Object.values(groupedResults);
  }
  async findByCustomerId(
    customerId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<FeedbackModel[]> {
    const offset = (page - 1) * pageSize;
    const result = await db
      .select()
      .from(t.feedbackPost)
      .where(eq(t.feedbackPost.customerId, customerId))
      .limit(pageSize)
      .offset(offset);
    return result;
  }

  async findByLaundryId(
    customerId: string,
    page: number = 1,
    pageSize: number = 10
  ) {
    const offset = (page - 1) * pageSize;
    const result = await db
      .select()
      .from(t.feedbackPost)
      .where(eq(t.feedbackPost.customerId, customerId))
      .limit(pageSize)
      .offset(offset)
      .leftJoin(t.feedbackImage, eq(t.feedbackImage.postId, t.feedbackPost.id));
  }

  async save(
    data: Omit<FeedbackModel, "id" | "created_at">
  ): Promise<FeedbackModel> {
    const saved = await db
      .insert(t.feedbackPost)
      .values({
        ...data,
        id: randomUUIDv7(),
      })
      .returning();
    return saved[0];
  }

  async saveImages(
    images: Omit<FeedbackImageModel, "id">[]
  ): Promise<FeedbackImageModel[]> {
    const saved = await db
      .insert(t.feedbackImage)
      .values(
        images.map((img) => {
          return {
            ...img,
            id: randomUUIDv7(),
          };
        })
      )
      .returning();
    return saved;
  }

  async deleteById(id: string): Promise<void> {
    await db.delete(t.feedbackPost).where(eq(t.feedbackPost.id, id));
  }

  async deleteImage(key: string): Promise<void> {
    await db.delete(t.feedbackPost).where(eq(t.feedbackPost.id, key));
  }
  async findById(id: string): Promise<FeedbackModel> {
    const result = await db
      .select()
      .from(t.feedbackPost)
      .where(eq(t.feedbackPost.id, id));
    return result[0];
  }
}
