import { integer, numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { laundry } from "./laundry";
import { customer } from "./customer";

export const order = pgTable("orders", {
  id: text().primaryKey(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp(),
  status: text().notNull(),
  delivery_type: text().notNull(),
  details: text().notNull(),
  latitude: numeric().notNull(),
  longitude: numeric().notNull(),
  total_inCents: integer().default(0),
  close_at: timestamp(),
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