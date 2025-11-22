import { Type } from "@sinclair/typebox";
import { DateISO } from "./date";

export const FeedbackType = Type.Object({
  id: Type.String({ format: "uuid" }),
  content: Type.String(),
  title: Type.String(),
  rate: Type.Integer(),
  created_at: Type.Union([DateISO, Type.Null()]),
  laundryId: Type.String({ format: "uuid" }),
  customerId: Type.String({ format: "uuid" }),
});

export const FeedbackImageType = Type.Object({
  id: Type.String({ format: "uuid" }),
  url: Type.String({ format: "uri" }),
  objectId: Type.String(),
  postId: Type.String({ format: "uuid" }),
});