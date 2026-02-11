class ProjectsController < ApplicationController
  def index
    render json: serialize(Project.all)
  end

  def show
    project = find_by_slug_or_id(Project)
    render json: serialize(project)

  rescue ActiveRecord::RecordNotFound
    render_not_found("Project not found")
  end

  private

  def serialize(project)
    ProjectResource.new(project).serialize
  end
end
