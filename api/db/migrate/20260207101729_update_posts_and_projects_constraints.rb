class UpdatePostsAndProjectsConstraints < ActiveRecord::Migration[8.1]
  def change
    # Make slug optional in both tables
    change_column_null :posts, :slug, true
    change_column_null :projects, :slug, true

    # Remove existing unique indexes on slug
    remove_index :posts, :slug
    remove_index :projects, :slug

    # Add partial unique indexes on slug (only when slug is not null)
    add_index :posts, :slug, unique: true, where: "slug IS NOT NULL", name: "index_posts_on_slug_unique"
    add_index :projects, :slug, unique: true, where: "slug IS NOT NULL", name: "index_projects_on_slug_unique"

    # Make title (posts) and name (projects) required
    change_column_null :posts, :title, false
    change_column_null :projects, :name, false

    # Add unique indexes on title and name
    add_index :posts, :title, unique: true
    add_index :projects, :name, unique: true

    # Add project_id foreign key to posts (one-to-many: project has many posts)
    add_reference :posts, :project, type: :uuid, foreign_key: true, null: true
  end
end
