import { Component, type ReactNode, type ErrorInfo } from 'react'

interface ErrorBoundaryProps {
    fallback: (error: Error, reset: () => void) => ReactNode
    children: ReactNode
}

interface ErrorBoundaryState {
    error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { error: null }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('[ErrorBoundary] Uncaught error:', error, errorInfo)
    }

    componentDidMount() {
        // Auto-reset error state on Vite HMR updates so the boundary
        // doesn't stay stuck showing the error page after a code fix.
        if (import.meta.hot) {
            import.meta.hot.on('vite:afterUpdate', () => {
                if (this.state.error) {
                    this.setState({ error: null })
                }
            })
        }
    }

    reset = () => {
        this.setState({ error: null })
    }

    render() {
        if (this.state.error) {
            return this.props.fallback(this.state.error, this.reset)
        }

        return this.props.children
    }
}

export default ErrorBoundary
