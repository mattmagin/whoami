class ProjectResource < ApplicationResource
  typelize_from Project

  attributes :id, :name, :description, :technologies, :published_at, :created_at, :updated_at, :deleted_at
end
