import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { customer } from "./customer";
import { laundry } from "./laundry";

export const feedbackPost = pgTable("feedbackPosts", {
  id: text().primaryKey(),
  title: text().notNull(),
  content: text().notNull(),
  rate: integer().notNull(),
  created_at: timestamp().defaultNow(),
  laundryId: text()
    .references(() => laundry.id, { onDelete: "cascade" })
    .notNull(),
  customerId: text()
    .references(() => customer.id, { onDelete: "cascade" })
    .notNull(),
});

export const feedbackImage = pgTable("feedbackImages", {
  id: text().primaryKey(),
  objectId: text().notNull(),
  url: text().notNull(),
  postId: text()
    .references(() => feedbackPost.id, { onDelete: "cascade" })
    .notNull(),
});