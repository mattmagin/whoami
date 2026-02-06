class CreatePosts < ActiveRecord::Migration[8.1]
  def change
    create_table :posts, id: :uuid do |t|
      t.string :title
      t.text :content
      t.datetime :published_at
      t.datetime :deleted_at

      t.timestamps
    end
  end
end
