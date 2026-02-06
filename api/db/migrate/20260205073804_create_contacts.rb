class CreateContacts < ActiveRecord::Migration[8.1]
  def change
    create_table :contacts, id: :uuid do |t|
      t.string :name
      t.string :email
      t.text :message

      t.timestamps
    end
  end
end
