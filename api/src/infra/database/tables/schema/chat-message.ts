import { randomUUIDv7 } from "bun";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { customer } from "./customer";
import { member } from "./member";

export const chatMessage = pgTable("chat_messages", {
  id: text()
    .primaryKey()
    .$default(() => randomUUIDv7()),
  customerId: text().references(() => customer.id, { onDelete: "cascade" }),
  memberId: text()
    .notNull()
    .references(() => member.id, { onDelete: "cascade" }),
  sended_at: timestamp().defaultNow()
});
