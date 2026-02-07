class CreateResumes < ActiveRecord::Migration[8.1]
  def change
    create_table :resumes, id: :uuid do |t|
      t.string :slug, null: false
      t.jsonb :data, null: false, default: {}
      t.timestamps
    end

    add_index :resumes, :slug, unique: true
  end
end
