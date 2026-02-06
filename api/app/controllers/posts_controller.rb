class PostsController < ApplicationController
    def index
        posts = Post.all.map do |post| 
            post.as_json.merge(reading_time: reading_time(post))
        end
        render json: posts
    end

    private

    def reading_time(post)
        ReadingTime.calculate(post.content)
    end
end
