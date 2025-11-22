import { Type } from "@sinclair/typebox";
import { DateISO, DateISO_String } from "./date";

export const OrderItemType = Type.Object({
  id: Type.String(),
  qntd: Type.Integer(),
  unitPrice_inCents: Type.Integer(),
  name: Type.String(),
  color: Type.String(),
  service: Type.String(),
  orderId: Type.String(),
});

export const OrderType = Type.Object({
  id: Type.String(),
  created_at: DateISO,
  updated_at: Type.Union([DateISO, Type.Null()]),
  close_at: Type.Union([DateISO_String, Type.Null()]),
  details: Type.String(),
  status: Type.String(),
  delivery_type: Type.String(),
  latitude: Type.String(),
  longitude: Type.String(),
  laundryId: Type.String(),
  customerId: Type.String(),
  total_inCents: Type.Union([Type.Integer(), Type.Null()]),
});