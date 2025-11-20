import { FeedbackImageModel, FeedbackModel } from "@/types/models";
import { FeedbackWithImages } from "@/types/return/feedback";

export interface IFeedbackRepository {
  save(data: Omit<FeedbackModel, "id" | "created_at">): Promise<FeedbackModel>;
  deleteById(id: string): Promise<void>;
  saveImages(
    images: Omit<FeedbackImageModel, "id">[]
  ): Promise<FeedbackImageModel[]>;
  deleteImage(key: string): Promise<void>;
  findWithInnerJoin(
    laundryId: string,
    page?: number,
    pageSize?: number
  ): Promise<FeedbackWithImages[]>;
  findByLaundryId(
    laundryId: string,
    page: number,
    pageSize: number
  ): Promise<any>;
  findByCustomerId(
    customerId: string,
    page: number,
    pageSize: number
  ): Promise<FeedbackModel[]>;
  findById(id: string): Promise<FeedbackModel>;
}