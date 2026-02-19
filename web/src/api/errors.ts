export class ApiError extends Error {
    status: number
    statusText: string
    detail: string | null

    constructor(status: number, statusText: string, detail: string | null = null) {
        super(`API Error ${status}: ${statusText}`)
        this.name = 'ApiError'
        this.status = status
        this.statusText = statusText
        this.detail = detail
    }
}

/**
 * Parse a non-ok Response into an ApiError.
 * Attempts to read a JSON body with `message` or `error` fields.
 */
export const parseApiError = async (res: Response): Promise<ApiError> => {
    let detail: string | null = null

    try {
        const body = await res.json()
        if (typeof body === 'object' && body !== null) {
            if (typeof body.message === 'string') {
                detail = body.message
            } else if (typeof body.error === 'string') {
                detail = body.error
            }
        }
    } catch {
        // Response body wasn't JSON — that's fine
    }

    return new ApiError(res.status, res.statusText, detail)
}

/**
 * Type guard to check if an unknown error is an ApiError.
 */
export const isApiError = (error: unknown): error is ApiError => {
    return error instanceof ApiError
}
