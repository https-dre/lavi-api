import { NotificationMetadata } from "@/types/notification-data";
import { jsonb, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const notifications = pgTable("notifications", {
  id: text().primaryKey(),
  type: varchar({ length: 100 }).notNull(),
  title: varchar({ length: 450 }).notNull(),
  content: varchar({ length: 500 }).notNull(),
  metadata: jsonb("metadata").$type<NotificationMetadata>(),
  status: varchar({ length: 10 }).notNull(),
  userId: text().notNull(),
  userType: varchar({ length: 10 }).notNull(),
  created_at: timestamp().defaultNow(),
});