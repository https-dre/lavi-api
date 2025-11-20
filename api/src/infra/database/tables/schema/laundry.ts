import { randomUUIDv7 } from "bun";
import { integer, numeric, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { member } from "./member";

export const laundry = pgTable("laundries", {
  id: text().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  profile_url: text(),
  email: text().notNull(),
  address: text().notNull(),
  opening: text().notNull(),
  longitude: numeric().notNull(),
  latitude: numeric().notNull(),
  cnpj_blind_index: text().unique(),
  cnpj: text().unique().notNull(),
  bank_code: text().notNull(),
  bank_agency: text().notNull(),
  account_number: text().unique().notNull(),
  account_type: text().notNull(),
  putEmployeeCode: text(),
  type: text().notNull(),
  created_at: timestamp().defaultNow(),
});

export const laundry_member = pgTable("laundry_member", {
  id: text()
    .primaryKey()
    .$defaultFn(() => randomUUIDv7()),
  laundryId: text()
    .references(() => laundry.id, { onDelete: "cascade" })
    .notNull(),
  memberId: text()
    .references(() => member.id, { onDelete: "cascade" })
    .notNull(),
  created_at: timestamp().defaultNow(),
});

export const laundryBanner = pgTable("laundryBanners", {
  id: text().primaryKey(),
  resource: text().notNull(),
  resource_key: text().notNull(),
  laundryId: text()
    .references(() => laundry.id, { onDelete: "cascade" })
    .notNull(),
});

export const laundryCatalogItem = pgTable("laundryCatalogItems", {
  id: text().primaryKey(),
  color: text().notNull(),
  units: integer().notNull(),
  priceInCents: integer().notNull(),
  clothing: text().notNull(),
  wash_cycle: text().notNull(),
  laundryId: text()
    .references(() => laundry.id, { onDelete: "cascade" })
    .notNull(),
});

export const laundryAlerts = pgTable("laundryAlerts", {
  id: text().primaryKey(),
  type: varchar({ length: 255 }).notNull(),
  title: varchar({ length: 450 }).notNull(),
  content: text().notNull(),
  status: varchar({ length: 100 }).notNull(),
  created_at: timestamp().defaultNow(),
  readed_at: timestamp(),
});