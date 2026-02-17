import {
    lightTheme,
    themes,
    type Theme,
    type ThemeKey,
    type LoggerStyleConfig,
} from '@/theme'

interface LoggerOptions {
    theme?: Theme
    enabled?: boolean
    batched?: boolean
}

const styleToString = (config: LoggerStyleConfig): string => {
    const parts: string[] = []
    if (config.color) parts.push(`color: ${config.color}`)
    if (config.fontSize) parts.push(`font-size: ${config.fontSize}`)
    if (config.fontWeight) parts.push(`font-weight: ${config.fontWeight}`)
    if (config.fontFamily) parts.push(`font-family: ${config.fontFamily}`)
    if (config.fontStyle) parts.push(`font-style: ${config.fontStyle}`)
    if (config.background) parts.push(`background: ${config.background}`)
    if (config.padding) parts.push(`padding: ${config.padding}`)
    if (config.borderRadius) parts.push(`border-radius: ${config.borderRadius}`)
    return parts.join('; ')
}

class Logger {
    private enabled: boolean
    private theme: Theme
    private batched: boolean
    private batchBuffer: { format: string; styles: string[] }

    constructor(options: LoggerOptions = {}) {
        const { theme = lightTheme, enabled = true, batched = false } = options
        this.enabled = enabled
        this.theme = theme
        this.batched = batched
        this.batchBuffer = { format: '', styles: [] }
    }

    // Set theme
    setTheme(themeOrKey: Theme | ThemeKey): this {
        this.theme = typeof themeOrKey === 'string' ? themes[themeOrKey] : themeOrKey
        return this
    }

    // Enable batch mode - collects all logs and outputs on flush()
    batch(): this {
        this.batched = true
        this.batchBuffer = { format: '', styles: [] }
        return this
    }

    endBatch(): this {
        if (this.enabled && this.batchBuffer.format) {
            console.log(this.batchBuffer.format, ...this.batchBuffer.styles)
        }
        this.batchBuffer = { format: '', styles: [] }
        this.batched = false
        return this
    }

    private log(message: string, style: string): this {
        if (!this.enabled) return this

        if (this.batched) {
            // Add newline between entries in batch mode
            if (this.batchBuffer.format) {
                this.batchBuffer.format += '\n'
            }
            this.batchBuffer.format += `%c${message}`
            this.batchBuffer.styles.push(style)
        } else {
            console.log(`%c${message}`, style)
        }
        return this
    }

    // Styled logging methods
    heading(message: string): this {
        return this.log(message, styleToString(this.theme.logger.heading))
    }

    subheading(message: string): this {
        return this.log(message, styleToString(this.theme.logger.subheading))
    }

    body(message: string): this {
        return this.log(message, styleToString(this.theme.logger.body))
    }

    accent(message: string): this {
        return this.log(message, styleToString(this.theme.logger.accent))
    }

    muted(message: string): this {
        return this.log(message, styleToString(this.theme.logger.muted))
    }

    link(message: string): this {
        return this.log(message, styleToString(this.theme.logger.link))
    }

    code(message: string): this {
        return this.log(message, styleToString(this.theme.logger.code))
    }

    success(message: string): this {
        return this.log(message, styleToString(this.theme.logger.success))
    }

    warning(message: string): this {
        return this.log(message, styleToString(this.theme.logger.warning))
    }

    error(message: string): this {
        return this.log(message, styleToString(this.theme.logger.error))
    }

    group(label: string, collapsed = false): this {
        if (this.enabled) {
            if (collapsed) {
                console.groupCollapsed(label)
            } else {
                console.group(label)
            }
        }
        return this
    }

    groupCollapsed(label: string): this {
        return this.group(label, true)
    }

    groupEnd(): this {
        if (this.enabled) {
            console.groupEnd()
        }
        return this
    }

    lineBreak(lines = 1): this {
        if (this.batched) {
            this.batchBuffer.format += '\n'.repeat(lines);
        } else {
            for (let i = 0; i < lines; i++) {
                console.log('')
            }
        }
        return this
    }

    divider(char = '─', length = 40): this {
        return this.muted(char.repeat(length))
    }
}

const logger = new Logger()

export { Logger, logger, type LoggerOptions }
export default logger
