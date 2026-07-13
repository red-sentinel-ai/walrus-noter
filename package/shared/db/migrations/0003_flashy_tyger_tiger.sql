ALTER TYPE "public"."auth_method" ADD VALUE 'enoki';--> statement-breakpoint
DROP TABLE "chats" CASCADE;--> statement-breakpoint
DROP TABLE "messages" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "delegatePrivateKey" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "delegateAccountId" text;--> statement-breakpoint
DROP TYPE "public"."ai_message_status";--> statement-breakpoint
DROP TYPE "public"."message_role";