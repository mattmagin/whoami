class Project < ApplicationRecord
  has_many :posts
  has_one_attached :feature_image

  before_validation :generate_slug, if: -> { slug.blank? && name.present? }

  def image_url
    if feature_image.attached?
      Rails.application.routes.url_helpers.rails_blob_url(
        feature_image,
        host: ENV.fetch("APP_HOST", "localhost:3000")
      )
    else
      read_attribute(:image_url)
    end
  end

  private

  def generate_slug
    self.slug = name.parameterize
  end
end
