import { randomUUIDv7 } from "bun";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { customer } from "./customer";
import { member } from "./member";

export const chat = pgTable("chats", {
  id: text()
    .primaryKey()
    .$defaultFn(() => randomUUIDv7()),
  customerId: text()
    .notNull()
    .references(() => customer.id, { onDelete: "cascade" }),
  memberId: text()
    .notNull()
    .references(() => member.id, { onDelete: "cascade" }),
  created_at: timestamp().defaultNow(),
});

export const chatMessage = pgTable("chat_messages", {
  id: text()
    .primaryKey()
    .$defaultFn(() => randomUUIDv7()),
  sender_type: varchar({ length: 10 }).notNull().$type<"member" | "customer">(),
  content: text().notNull(),
  status: text().notNull().$type<"sent" | "delivered" | "read" | "failed">(),
  chat_id: text()
    .notNull()
    .references(() => chat.id, { onDelete: "cascade" }),
  created_at: timestamp().defaultNow(),
});
