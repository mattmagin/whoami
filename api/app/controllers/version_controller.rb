class VersionController < ApplicationController
  # Lightweight endpoint returning a content hash.
  # The frontend checks this on mount — if the hash changed since the last
  # visit, it invalidates the query cache and refetches everything.
  #
  # The hash is derived from the latest updated_at across all content tables
  # so it changes whenever any record is created, updated, or deleted.
  def show
    timestamps = [
      Post.maximum(:updated_at),
      Project.maximum(:updated_at),
      Resume.maximum(:updated_at)
    ].compact

    version = if timestamps.any?
                Digest::SHA256.hexdigest(timestamps.max.to_s)[0, 12]
              else
                "empty"
              end

    render json: { version: version }
  end
end
