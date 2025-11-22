import { Type } from "@sinclair/typebox";
import { DateISO } from "./date";

export const MemberType = Type.Object({
  id: Type.String({ format: "uuid" }),
  profile_url: Type.Union([Type.String(), Type.Null()]),
  name: Type.String(),
  email: Type.String({ format: "email" }),
  cpf: Type.String({ maxLength: 11 }),
  password: Type.String({ minLength: 8 }),
  roles: Type.Array(Type.String(), { minItems: 1 }),
  created_at: Type.Union([DateISO, Type.Null()]),
});