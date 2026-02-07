# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_02_07_103850) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "contacts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email"
    t.text "message"
    t.string "name"
    t.datetime "updated_at", null: false
  end

  create_table "posts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "deleted_at"
    t.text "excerpt"
    t.uuid "project_id"
    t.datetime "published_at"
    t.string "slug", null: false
    t.string "tags", default: [], array: true
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_posts_on_project_id"
    t.index ["slug"], name: "index_posts_on_slug", unique: true
    t.index ["title"], name: "index_posts_on_title", unique: true
  end

  create_table "projects", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "deleted_at"
    t.text "description"
    t.text "excerpt"
    t.boolean "featured", default: false, null: false
    t.string "github_url"
    t.string "image_url"
    t.string "name", null: false
    t.datetime "published_at"
    t.string "slug", null: false
    t.string "tech_stack", array: true
    t.datetime "updated_at", null: false
    t.string "url"
    t.index ["name"], name: "index_projects_on_name", unique: true
    t.index ["slug"], name: "index_projects_on_slug", unique: true
  end

  add_foreign_key "posts", "projects"
end
