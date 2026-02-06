class ApplicationController < ActionController::API
  ERRORS = {
    not_found: { code: 'not_found', status: 404 },
    invalid: { code: 'invalid_content', status: 422 },
    unauthorized: { code: 'unauthorized', status: 401 },
    forbidden: { code: 'forbidden', status: 403 },
    server_error: { code: 'server_error', status: 500 }
  }.freeze

  def render_not_found(message = 'Resource not found')
    render_error(:not_found, message)
  end

  def render_invalid(message = 'Resource is invalid')
    render_error(:invalid, message)
  end

  def render_unauthorized(message = 'Unauthorized')
    render_error(:unauthorized, message)
  end

  def render_forbidden(message = 'Forbidden')
    render_error(:forbidden, message)
  end

  private

  def render_error(type, message)
    error = ERRORS.fetch(type) { ERRORS[:server_error] }
    render json: { error: error[:code], message: message }, status: error[:status]
  end
end
