CREATE TABLE "education" (
	"id" serial PRIMARY KEY NOT NULL,
	"school" text NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"start_date" text DEFAULT '' NOT NULL,
	"end_date" text DEFAULT '' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "experience" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_title" text NOT NULL,
	"company" text NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"start_date" text DEFAULT '' NOT NULL,
	"end_date" text DEFAULT '' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"date" text DEFAULT '' NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"author" text DEFAULT '' NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"github" text,
	"live_url" text,
	"content" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "site_profile" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"name" text NOT NULL,
	"short_name" text NOT NULL,
	"role" text NOT NULL,
	"location" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"current_role" text NOT NULL,
	"summary" text NOT NULL,
	"resume_summary" text NOT NULL,
	"image_path" text DEFAULT '/headshot-on-white.jpg' NOT NULL,
	"github" text,
	"linkedin" text,
	"x" text,
	"instagram" text,
	"facebook" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
