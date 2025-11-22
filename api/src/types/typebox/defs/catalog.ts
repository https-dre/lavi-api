import { Type } from "@sinclair/typebox";

export const CatalogItemType = Type.Object({
  id: Type.String({ format: "uuid" }),
  color: Type.String(),
  units: Type.Integer(),
  priceInCents: Type.Integer(),
  clothing: Type.String(),
  wash_cycle: Type.String(),
  laundryId: Type.String({ format: "uuid" }),
});