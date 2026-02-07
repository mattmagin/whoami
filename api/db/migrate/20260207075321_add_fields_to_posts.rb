class AddFieldsToPosts < ActiveRecord::Migration[8.1]
  def change
    add_column :posts, :slug, :string
    add_column :posts, :excerpt, :text
    add_column :posts, :tags, :string, array: true, default: []

    reversible do |dir|
      dir.up do
        # Generate slugs for existing posts based on title
        execute <<-SQL
          UPDATE posts
          SET slug = LOWER(REGEXP_REPLACE(COALESCE(title, id::text), '[^a-zA-Z0-9]+', '-', 'g'))
          WHERE slug IS NULL
        SQL
      end
    end

    change_column_null :posts, :slug, false
    add_index :posts, :slug, unique: true
  end
end
