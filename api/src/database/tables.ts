import { randomUUIDv7 } from "bun";
import {
  text,
  pgTable,
  varchar,
  integer,
  numeric,
  char,
  boolean,
  timestamp,
  date,
} from "drizzle-orm/pg-core";

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

export const member = pgTable("members", {
  id: text().primaryKey(),
  profile_url: text(),
  name: text().notNull(),
  email: text().notNull(),
  email_blind_index: text().notNull(),
  cpf: text().notNull(),
  cpf_blind_index: text().notNull(),
  password: text().notNull(),
  roles: text().array().notNull(),
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
  resource: text(),
  resource_key: text(),
  laundryId: text().references(() => laundry.id, { onDelete: "cascade" }),
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

export const order = pgTable("orders", {
  id: text().primaryKey(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp(),
  status: text().notNull(),
  delivery_type: text().notNull(),
  details: text().notNull(),
  latitude: numeric().notNull(),
  longitude: numeric().notNull(),
  laundryId: text()
    .references(() => laundry.id, { onDelete: "set null" })
    .notNull(),
  customerId: text()
    .references(() => customer.id, { onDelete: "set null" })
    .notNull(),
});

export const orderItem = pgTable("orderItems", {
  id: text().primaryKey(),
  qntd: integer().notNull(),
  unitPrice_inCents: integer().notNull(),
  name: text().notNull(),
  service: text().notNull(),
  color: text().notNull(),
  orderId: text()
    .references(() => order.id, { onDelete: "cascade" })
    .notNull(),
});

export const feedbackPost = pgTable("feedbackPosts", {
  id: text().primaryKey(),
  title: text().notNull(),
  content: text().notNull(),
  rate: integer().notNull(),
  created_at: timestamp().defaultNow(),
  laundryId: text().references(() => laundry.id, { onDelete: "cascade" }).notNull(),
  customerId: text().references(() => customer.id, { onDelete: "cascade" }).notNull(),
});

export const feedbackImage = pgTable("feedbackImages", {
  id: text().primaryKey(),
  objectId: text().notNull(),
  url: text().notNull(),
  postId: text().references(() => feedbackPost.id, { onDelete: "cascade" }).notNull(),
});

const tables = {
  laundry,
  laundryBanner,
  customer,
  customerAddress,
  order,
  orderItem,
  feedbackPost,
  feedbackImage,
  member,
};

export default tables;
