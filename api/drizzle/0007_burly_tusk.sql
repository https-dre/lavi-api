CREATE TABLE "chat_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"customerId" text,
	"memberId" text NOT NULL,
	"sended_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_customerId_customers_id_fk" FOREIGN KEY ("customerId") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_memberId_members_id_fk" FOREIGN KEY ("memberId") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;