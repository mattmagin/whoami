import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Button, Container } from '@/components/ui'
import ErrorState from '@/components/ErrorState'
import { ERROR_TYPE } from '@/consts'

const NotFound = () => {
    return (
        <Container size="md" padding="lg">
            <ErrorState
                errorType={ERROR_TYPE.NOT_FOUND}
                actions={
                    <Button asChild variant="outline">
                        <Link to="/">
                            <Home className="mr-2 h-4 w-4" />
                            Go home
                        </Link>
                    </Button>
                }
            />
        </Container>
    )
}

export default NotFound
