import { Type } from "@sinclair/typebox";

export const DateISO = Type.Transform(
  Type.Date({
    format: "date-time",
    description: "Date with format ISO 8601",
    default: "2025-09-18T19:35:25.102Z",
  })
)
  .Decode((value) => value.toISOString())
  .Encode((value) => new Date(value));

export const DateString = Type.String({
  description: "Date with format YYYY-MM-DD",
  default: "2000-01-01",
  examples: ["2007-05-02"],
});

export const DateISO_String = Type.Transform(
  Type.String({
    format: "date-time",
    description: "Date with format ISO 8601",
    default: "2025-09-18T19:35:25.102Z",
  })
)
  .Decode((value) => new Date(value))
  .Encode((value) => value.toISOString());