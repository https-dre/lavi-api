import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

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