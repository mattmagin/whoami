class Resume < ApplicationRecord
  validates :slug, presence: true, uniqueness: true
  validates :data, presence: true

  # Parse YAML data and return as hash
  def parsed_data
    @parsed_data ||= YAML.safe_load(data, permitted_classes: [Symbol])
  end
end
