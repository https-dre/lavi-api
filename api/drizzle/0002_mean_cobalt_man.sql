CREATE TABLE "laundryCatalogItems" (
	"id" text PRIMARY KEY NOT NULL,
	"color" text NOT NULL,
	"units" integer NOT NULL,
	"priceInCents" integer NOT NULL,
	"clothing" text NOT NULL,
	"wash_cycle" text NOT NULL,
	"laundryId" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "feedbackImages" ALTER COLUMN "postId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "feedbackPosts" ALTER COLUMN "rate" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "feedbackPosts" ALTER COLUMN "laundryId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "feedbackPosts" ALTER COLUMN "customerId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "address" text DEFAULT 'Null Address' NOT NULL;--> statement-breakpoint
ALTER TABLE "feedbackImages" ADD COLUMN "objectId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "feedbackPosts" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orderItems" ADD COLUMN "color" text NOT NULL;--> statement-breakpoint
ALTER TABLE "laundryCatalogItems" ADD CONSTRAINT "laundryCatalogItems_laundryId_laundries_id_fk" FOREIGN KEY ("laundryId") REFERENCES "public"."laundries"("id") ON DELETE cascade ON UPDATE no action;