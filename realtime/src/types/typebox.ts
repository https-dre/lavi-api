import { Type } from "@sinclair/typebox";

const DateISO = Type.Transform(
  Type.Date({
    format: "date-time",
    description: "Date with format ISO 8601",
    default: "2025-09-18T19:35:25.102Z",
  })
)
  .Decode((value) => value.toISOString())
  .Encode((value) => new Date(value));

const DateString = Type.String({
  description: "Date with format YYYY-MM-DD",
  default: "2000-01-01",
  examples: ["2007-05-02"],
});

export const zCustomer = Type.Object({
  id: Type.String(),
  profile_url: Type.Union([Type.String(), Type.Null()]),
  address: Type.String(),
  name: Type.String(),
  email: Type.String(),
  is_pj: Type.Boolean(),
  doc: Type.String(),
  birth_date: DateString,
  gender: Type.String(),
  password: Type.String(),
  created_at: Type.Union([DateISO, Type.Null()]),
});

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
  details: Type.String(),
  status: Type.String(),
  delivery_type: Type.String(),
  latitude: Type.String(),
  longitude: Type.String(),
  laundryId: Type.String(),
  customerId: Type.String(),
});

export const zMember = Type.Object({
  id: Type.String({ format: "uuid" }),
  profile_url: Type.Union([Type.String(), Type.Null()]),
  name: Type.String(),
  email: Type.String({ format: "email" }),
  cpf: Type.String({ maxLength: 11 }),
  password: Type.String({ minLength: 8 }),
  roles: Type.Array(Type.String(), { minItems: 1 }),
  created_at: Type.Union([DateISO, Type.Null()]),
});

export const zCatalogItem = Type.Object({
  id: Type.String({ format: "uuid" }),
  color: Type.String(),
  units: Type.Integer(),
  priceInCents: Type.Integer(),
  clothing: Type.String(),
  wash_cycle: Type.String(),
  laundryId: Type.String({ format: "uuid" }),
});

export const zFeedback = Type.Object({
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