import { Type } from "@sinclair/typebox";
import { DateISO } from "./date";

export const zNotification = Type.Object({
  id: Type.String({ format: "uuid" }),
  type: Type.String({ maxLength: 100 }),
  metadata: Type.Union([Type.Any(), Type.Null()]),
  title: Type.String({ maxLength: 450 }),
  content: Type.String({ maxLength: 500 }),
  status: Type.String({ maxLength: 10 }),
  userId: Type.String({ format: "uuid" }),
  userType: Type.String({ maxLength: 10 }),
  created_at: Type.Union([DateISO, Type.Null()]),
});