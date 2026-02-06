class CreateProjects < ActiveRecord::Migration[8.1]
  def change
    create_table :projects, id: :uuid do |t|
      t.string :name
      t.text :description
      t.string :technologies, array: true
      t.datetime :published_at
      t.datetime :deleted_at

      t.timestamps
    end
  end
end
