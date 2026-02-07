class ChangeResumesDataToText < ActiveRecord::Migration[8.1]
  def change
    change_column :resumes, :data, :text, null: false, default: ''
  end
end
