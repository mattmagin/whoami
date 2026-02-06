class ProjectsController < ApplicationController
    def index
        render json: projects
    end

    private

    def projects
        Project.all
    end
end
