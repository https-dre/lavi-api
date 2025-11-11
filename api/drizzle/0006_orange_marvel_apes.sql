ALTER TABLE "orders" ADD COLUMN "total_inCents" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "close_at" timestamp;