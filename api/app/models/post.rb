class Post < ApplicationRecord
  belongs_to :project, optional: true

  before_validation :generate_slug, if: -> { slug.blank? && title.present? }

  private

  def generate_slug
    self.slug = title.parameterize
  end
end
