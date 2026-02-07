class PostResource < ApplicationResource
  typelize_from Post

  attributes :id, :slug, :title, :excerpt, :content, :tags, :published_at, :created_at, :updated_at, :deleted_at

  typelize reading_time: :string
  attribute :reading_time do |post|
    ReadingTime.format(post.content)
  end
end
