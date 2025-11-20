CREATE TABLE "chats" (
	"id" text PRIMARY KEY NOT NULL,
	"customerId" text NOT NULL,
	"memberId" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "chat_messages" DROP CONSTRAINT "chat_messages_customerId_customers_id_fk";
--> statement-breakpoint
ALTER TABLE "chat_messages" DROP CONSTRAINT "chat_messages_memberId_members_id_fk";
--> statement-breakpoint
ALTER TABLE "chat_messages" ADD COLUMN "sender_type" varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD COLUMN "content" text NOT NULL;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_customerId_customers_id_fk" FOREIGN KEY ("customerId") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_memberId_members_id_fk" FOREIGN KEY ("memberId") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" DROP COLUMN "customerId";--> statement-breakpoint
ALTER TABLE "chat_messages" DROP COLUMN "memberId";