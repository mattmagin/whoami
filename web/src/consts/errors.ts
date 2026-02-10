export const ERROR_TYPE = {
    FETCH: 'fetch',
    RENDER: 'render',
    NOT_FOUND: 'not_found',
} as const

export type ErrorType = typeof ERROR_TYPE[keyof typeof ERROR_TYPE]

export interface ErrorDefinition {
    title: string
    message: string
    quips: string[]
    codes: string[]
}

export const ERROR_DEFINITIONS: Record<ErrorType, ErrorDefinition> = {
    [ERROR_TYPE.FETCH]: {
        title: 'Failed to load content',
        message: "We couldn't load the content you requested. Please try again.",
        quips: [
            'The server is on a coffee break.',
            'Looks like the bits got lost in transit.',
            'The hamsters powering the server need a rest.',
            'Our carrier pigeons seem to be lost.',
        ],
        codes: [
            'ERR_CAFFEINE_DEPLETED',
            'ERR_PACKET_LOST_IN_MAIL',
            'ERR_SERVER_NAPPING',
            'ERR_TUBES_CLOGGED',
        ],
    },
    [ERROR_TYPE.RENDER]: {
        title: 'Something went wrong',
        message: 'An unexpected error occurred. Please try again or reload the page.',
        quips: [
            "Well, that wasn't supposed to happen.",
            'The pixels are in disarray.',
            'Something broke. Probably not your fault.',
            'Our code monkeys are investigating.',
        ],
        codes: [
            'ERR_COFFEE_OVERFLOW',
            'SEGFAULT_IN_VIBES',
            'PANIC_AT_THE_DISCO',
            'TASK_FAILED_SUCCESSFULLY',
            'EXCEPTION_IN_GOOD_INTENTIONS',
        ],
    },
    [ERROR_TYPE.NOT_FOUND]: {
        title: 'Page Not Found',
        message: "The page you're looking for doesn't exist or has been moved.",
        quips: [
            'Looks like you took a wrong turn.',
            'This page is off getting coffee.',
            "You've ventured into the void.",
            'Nothing to see here... literally.',
            'The page you seek does not exist in this dimension.',
        ],
        codes: [
            'ERR_WRONG_TURN',
            'ERR_PAGE_ELOPED',
            'ERR_VOID_STARED_BACK',
            'ERR_404_COFFEE_NOT_FOUND',
        ],
    },
}
