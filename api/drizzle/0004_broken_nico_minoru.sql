CREATE TABLE "laundryAlerts" (
	"id" text PRIMARY KEY NOT NULL,
	"type" varchar(255) NOT NULL,
	"title" varchar(450) NOT NULL,
	"content" text NOT NULL,
	"status" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"readed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"type" varchar(100) NOT NULL,
	"title" varchar(450) NOT NULL,
	"content" varchar(500) NOT NULL,
	"metadata" jsonb,
	"status" varchar(10) NOT NULL,
	"userId" text NOT NULL,
	"userType" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
