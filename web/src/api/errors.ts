import { HTTPError } from 'ky'

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
 * Parse a ky HTTPError (or any unknown error) into an ApiError.
 * Attempts to read a JSON body with `error` or `errors` fields (Rails convention).
 */
export const parseApiError = async (error: unknown): Promise<ApiError> => {
    if (error instanceof ApiError) {
        return error
    }

    if (error instanceof HTTPError) {
        const { status, statusText } = error.response
        let detail: string | null = null

        try {
            const body = await error.response.json()
            if (typeof body === 'object' && body !== null) {
                if (typeof body.error === 'string') {
                    detail = body.error
                } else if (Array.isArray(body.errors)) {
                    detail = body.errors.join(', ')
                }
            }
        } catch {
            // Response body wasn't JSON — that's fine
        }

        return new ApiError(status, statusText, detail)
    }

    if (error instanceof Error) {
        return new ApiError(0, error.message)
    }

    return new ApiError(0, 'An unknown error occurred')
}

/**
 * Type guard to check if an unknown error is an ApiError.
 */
export const isApiError = (error: unknown): error is ApiError => {
    return error instanceof ApiError
}
