import { Type } from "@sinclair/typebox";
import { DateISO } from "./date";

export const zLaundry = Type.Object({
  id: Type.String(),
  name: Type.String(),
  email: Type.String({ format: "email" }),
  profile_url: Type.Union([Type.String(), Type.Null()]),
  cnpj: Type.String(),
  address: Type.String(),
  latitude: Type.String(),
  longitude: Type.String(),
  bank_code: Type.String(),
  bank_agency: Type.String(),
  account_number: Type.String(),
  account_type: Type.String(),
  type: Type.String(),
  opening: Type.String(),
  putEmployeeCode: Type.Union([Type.String(), Type.Null()]),
  created_at: Type.Union([DateISO, Type.Null()]),
});

export const LaundryBannerType = Type.Object({
  id: Type.String({ format: "uuid" }),
  resource: Type.String(),
  resource_key: Type.String(),
  laundryId: Type.String({ format: "uuid" }),
});

export const TLaundryWithAverage = Type.Composite([
  zLaundry,
  Type.Object({
    reviewsCount: Type.Number(),
    averageRating: Type.Union([Type.String(), Type.Null()]),
  }),
]);
