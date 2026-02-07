class ResumeController < ApplicationController
  def index
    resume = Resume.find_by(slug: 'primary')
    return render_not_found('Resume not found') unless resume

    render json: resume.parsed_data
  end
end
