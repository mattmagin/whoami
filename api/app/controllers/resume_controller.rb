class ResumeController < ApplicationController
  def index
    return render_not_found('Resume file not found') unless exists?
    # return render_invalid('Resume file failed validation') unless valid?
    send_resume
  end

  private
  def path
    'content/resume.md'
  end

  def exists?
    File.exist?(path)
  end

#   TODO: validate markdown.... only will need this on updates?
#   def valid?
#     results = MarkdownLint::Doc.new(File.read(path), path)
#     # rules = MarkdownLint::RuleSet.new.default_rules
#     MarkdownLint.run([path]).empty?
#   end

  def send_resume
    send_file path, type: 'text/markdown', disposition: 'inline', status: :ok
  end
end
