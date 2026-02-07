class ProjectResource < ApplicationResource
  typelize_from Project

  attributes :id, :slug, :name, :excerpt, :description, :tech_stack, :url, :github_url, :featured, :image_url, :published_at, :created_at, :updated_at, :deleted_at
end
