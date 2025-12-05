import { Type } from "@sinclair/typebox";
import { DateISO } from "./date";

export const zChat = Type.Object({
  id: Type.String({ format: "uuid" }),
  laundryId: Type.String({ format: "uuid" }),
  customerId: Type.String({ format: "uuid" }),
  memberId: Type.Union([Type.String(), Type.Null()]),
  created_at: Type.Union([DateISO, Type.Null()]),
});