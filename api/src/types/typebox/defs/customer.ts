import { Type } from "@sinclair/typebox";
import { DateISO, DateString } from "./date";

export const CustomerType = Type.Object({
  id: Type.String(),
  profile_url: Type.Union([Type.String(), Type.Null()]),
  address: Type.String(),
  name: Type.String(),
  email: Type.String(),
  is_pj: Type.Boolean(),
  doc: Type.String(),
  cep: Type.String(),
  birth_date: DateString,
  gender: Type.String(),
  password: Type.String(),
  created_at: Type.Union([DateISO, Type.Null()]),
});