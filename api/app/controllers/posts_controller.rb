class PostsController < ApplicationController
  def index
    render json: serialize(Post.all)
  end

  def show
    post = Post.find(params[:id])
    render json: serialize(post)

  rescue ActiveRecord::RecordNotFound
    render_not_found("Post not found")
  end

  private

  def serialize(post)
    PostResource.new(post).serialize
  end
end
