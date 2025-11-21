ALTER TABLE "chats" DROP CONSTRAINT "chats_customerId_customers_id_fk";
--> statement-breakpoint
ALTER TABLE "chats" DROP CONSTRAINT "chats_memberId_members_id_fk";
--> statement-breakpoint
ALTER TABLE "chats" ALTER COLUMN "memberId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "chats" ADD COLUMN "laundryId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD COLUMN "sender_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD COLUMN "status" text NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD COLUMN "chat_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_laundryId_laundries_id_fk" FOREIGN KEY ("laundryId") REFERENCES "public"."laundries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_customerId_customers_id_fk" FOREIGN KEY ("customerId") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_memberId_members_id_fk" FOREIGN KEY ("memberId") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_chat_id_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;