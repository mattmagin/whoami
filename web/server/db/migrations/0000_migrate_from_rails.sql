-- Migration: Transition from Rails Active Storage to plain URL columns
-- This migration should be run against the existing Rails-managed database

-- Add feature_image_url column to posts (projects already has image_url)
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "feature_image_url" text;

-- Drop Active Storage tables (no longer needed)
DROP TABLE IF EXISTS "active_storage_variant_records" CASCADE;
DROP TABLE IF EXISTS "active_storage_attachments" CASCADE;
DROP TABLE IF EXISTS "active_storage_blobs" CASCADE;

-- Drop Rails-specific tables if they exist
DROP TABLE IF EXISTS "ar_internal_metadata" CASCADE;
DROP TABLE IF EXISTS "schema_migrations" CASCADE;

-- Add database-level defaults for timestamp columns
-- (Rails managed these in application code; Drizzle expects DB defaults)
ALTER TABLE "posts" ALTER COLUMN "created_at" SET DEFAULT now();
ALTER TABLE "posts" ALTER COLUMN "updated_at" SET DEFAULT now();
ALTER TABLE "projects" ALTER COLUMN "created_at" SET DEFAULT now();
ALTER TABLE "projects" ALTER COLUMN "updated_at" SET DEFAULT now();
ALTER TABLE "contacts" ALTER COLUMN "created_at" SET DEFAULT now();
ALTER TABLE "contacts" ALTER COLUMN "updated_at" SET DEFAULT now();
ALTER TABLE "resumes" ALTER COLUMN "created_at" SET DEFAULT now();
ALTER TABLE "resumes" ALTER COLUMN "updated_at" SET DEFAULT now();
