class AddFieldsToProjects < ActiveRecord::Migration[8.1]
  def change
    add_column :projects, :slug, :string
    add_column :projects, :excerpt, :text
    add_column :projects, :url, :string
    add_column :projects, :github_url, :string
    add_column :projects, :featured, :boolean, default: false, null: false
    add_column :projects, :image_url, :string
    rename_column :projects, :technologies, :tech_stack

    reversible do |dir|
      dir.up do
        # Generate slugs for existing projects based on name
        execute <<-SQL
          UPDATE projects
          SET slug = LOWER(REGEXP_REPLACE(COALESCE(name, id::text), '[^a-zA-Z0-9]+', '-', 'g'))
          WHERE slug IS NULL
        SQL
      end
    end

    change_column_null :projects, :slug, false
    add_index :projects, :slug, unique: true
  end
end
