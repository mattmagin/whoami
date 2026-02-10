import { Suspense, useEffect } from 'react'
import { Toaster } from 'sonner'
import { MainContainer } from '@/components'
import CommandPalette from '@/components/CommandPalette'
import ErrorBoundary from '@/components/ErrorBoundary'
import RenderErrorFallback from '@/components/RenderErrorFallback'
import logger from '@/lib/logger'
import Providers from './providers'
import { strings } from './content'
import Pages from './pages'

const App = () => {
  useEffect(() => {
    // TODO: move strings to strings.json
    // TODO: build out a basic way to define this all as an object/array
    logger
      .batch()
      .heading('Hello There!')
      .subheading('👀 You must be a curious one!')
      .lineBreak()
      .body('Wanna know how this site was built? Check out the source code on github: ')
      .link('https://git.magin.tech/portfolio')
      .lineBreak()
      .body('or try: ')
      .code(`${strings.common.sshCommand}`)
      .lineBreak()
      .error("This is an error message")
      .muted('Built with React, TypeScript, Tailwind, and a lot of ☕')
      .endBatch()
  }, [])

  return (
    <Providers>
      <ErrorBoundary
        fallback={(error, reset) => (
          <RenderErrorFallback error={error} reset={reset} fullPage />
        )}
      >
        {/* TODO implement suspense if needed */}
        <Suspense fallback={<div>Loading...</div>}>
          <CommandPalette />
          <MainContainer>
            <Pages />
          </MainContainer>
        </Suspense>
        <Toaster position="bottom-center" />
      </ErrorBoundary>
    </Providers>
  )
}

export default App
