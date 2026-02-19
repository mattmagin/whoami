CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar,
	"email" varchar,
	"message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar NOT NULL,
	"title" varchar NOT NULL,
	"excerpt" text,
	"content" text,
	"tags" varchar[],
	"feature_image_url" text,
	"project_id" uuid,
	"published_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar NOT NULL,
	"name" varchar NOT NULL,
	"excerpt" text,
	"description" text,
	"tech_stack" varchar[],
	"url" varchar,
	"github_url" varchar,
	"image_url" varchar,
	"featured" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resume_certifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resume_id" uuid NOT NULL,
	"name" varchar NOT NULL,
	"year" integer,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resume_education" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resume_id" uuid NOT NULL,
	"degree" varchar NOT NULL,
	"institution" varchar NOT NULL,
	"location" varchar,
	"start_year" integer,
	"end_year" integer,
	"details" text[],
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resume_experiences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resume_id" uuid NOT NULL,
	"title" varchar NOT NULL,
	"company" varchar NOT NULL,
	"location" varchar,
	"start_date" date NOT NULL,
	"end_date" date,
	"current" boolean DEFAULT false NOT NULL,
	"highlights" text[],
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resume_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resume_id" uuid NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"technologies" varchar[],
	"project_id" uuid,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resume_skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resume_id" uuid NOT NULL,
	"category" varchar NOT NULL,
	"name" varchar NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "resumes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar NOT NULL,
	"name" varchar NOT NULL,
	"title" varchar NOT NULL,
	"summary" text,
	"email" varchar,
	"location" varchar,
	"github_url" varchar,
	"linkedin_url" varchar,
	"website_url" varchar,
	"interests" varchar[],
	"published_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resume_certifications" ADD CONSTRAINT "resume_certifications_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resume_education" ADD CONSTRAINT "resume_education_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resume_experiences" ADD CONSTRAINT "resume_experiences_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resume_projects" ADD CONSTRAINT "resume_projects_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resume_projects" ADD CONSTRAINT "resume_projects_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resume_skills" ADD CONSTRAINT "resume_skills_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "index_posts_on_slug" ON "posts" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "index_posts_on_title" ON "posts" USING btree ("title");--> statement-breakpoint
CREATE INDEX "index_posts_on_project_id" ON "posts" USING btree ("project_id");--> statement-breakpoint
CREATE UNIQUE INDEX "index_projects_on_slug" ON "projects" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "index_projects_on_name" ON "projects" USING btree ("name");--> statement-breakpoint
CREATE INDEX "index_resume_certifications_on_resume_id" ON "resume_certifications" USING btree ("resume_id");--> statement-breakpoint
CREATE INDEX "index_resume_education_on_resume_id" ON "resume_education" USING btree ("resume_id");--> statement-breakpoint
CREATE INDEX "index_resume_experiences_on_resume_id" ON "resume_experiences" USING btree ("resume_id");--> statement-breakpoint
CREATE INDEX "index_resume_projects_on_resume_id" ON "resume_projects" USING btree ("resume_id");--> statement-breakpoint
CREATE INDEX "index_resume_projects_on_project_id" ON "resume_projects" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "index_resume_skills_on_resume_id" ON "resume_skills" USING btree ("resume_id");--> statement-breakpoint
CREATE UNIQUE INDEX "index_resumes_on_slug" ON "resumes" USING btree ("slug");