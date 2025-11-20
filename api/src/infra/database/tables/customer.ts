import { boolean, date, numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const customer = pgTable("customers", {
  id: text().primaryKey(),
  profile_url: text(),
  address: text().notNull().default("Null Address"),
  name: text().notNull(),
  email_blind_index: text().notNull().unique(),
  email: text().notNull(),
  is_pj: boolean().default(false).notNull(),
  doc_blind_index: text().notNull().unique(),
  doc: text().notNull(),
  cep: text().notNull().default("null"),
  birth_date: date().notNull(),
  gender: text().notNull(),
  password: text().notNull(),
  created_at: timestamp().defaultNow(),
});

export const customerAddress = pgTable("customerAddresses", {
  id: text().primaryKey(),
  name: text(),
  latitude: numeric(),
  longitude: numeric(),
  customerId: text().references(() => customer.id, { onDelete: "cascade" }),
});