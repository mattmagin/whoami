class MakeSlugsRequired < ActiveRecord::Migration[8.1]
  def change
    # Make slugs required
    change_column_null :posts, :slug, false
    change_column_null :projects, :slug, false

    # Replace partial unique indexes with full unique indexes
    remove_index :posts, name: "index_posts_on_slug_unique"
    remove_index :projects, name: "index_projects_on_slug_unique"

    add_index :posts, :slug, unique: true
    add_index :projects, :slug, unique: true
  end
end
