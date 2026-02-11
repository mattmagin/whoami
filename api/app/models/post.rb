class Post < ApplicationRecord
  belongs_to :project, optional: true
  has_one_attached :feature_image

  before_validation :generate_slug, if: -> { slug.blank? && title.present? }

  def feature_image_url
    return nil unless feature_image.attached?

    Rails.application.routes.url_helpers.rails_blob_url(
      feature_image,
      host: ENV.fetch("APP_HOST", "localhost:3000")
    )
  end

  private

  def generate_slug
    self.slug = title.parameterize
  end
end
