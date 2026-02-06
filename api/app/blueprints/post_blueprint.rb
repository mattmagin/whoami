class PostBlueprint < Blueprinter::Base
    identifier :id
    fields :slug, :title, :content, :published_at

    field :reading_time do |post|
        ReadingTime.calculate(post.content)
    end
end