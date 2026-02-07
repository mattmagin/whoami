import { Suspense, useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { queryClient } from '@/lib/queryClient'
import { ThemeProvider } from '@/hooks/ThemeContext'
import { Layout } from '@/components/layout'
import CommandPalette from '@/components/CommandPalette'
import { Home, Resume, Blog, BlogPost, Projects, Contact } from '@/pages'
import { consoleAsciiArt } from '@/content'

// Console Easter Egg
const useConsoleEasterEgg = () => {
  useEffect(() => {
    console.log(
      `%c${consoleAsciiArt}`,
      'color: #4a7c59; font-family: monospace; font-size: 10px;'
    )
    console.log(
      '%c👀 Hey, you found the secret!',
      'color: #2d5a3d; font-size: 16px; font-weight: bold;'
    )
    console.log(
      '%cCurious about how this site was built? Check out the source code or try: %cssh visitor@yoursite.com',
      'color: #666; font-size: 12px;',
      'color: #4a7c59; font-size: 12px; font-family: monospace; background: #f0f0f0; padding: 2px 6px; border-radius: 3px;'
    )
    console.log(
      '%c\nBuilt with React, TypeScript, Tailwind, and a lot of ☕',
      'color: #888; font-size: 11px; font-style: italic;'
    )
  }, [])
}

const App = () => {
  useConsoleEasterEgg()

  return (
    <QueryClientProvider client={queryClient}>
      {/* TODO implement suspense */}
      <Suspense fallback={<div>Loading...</div>}>
        <ThemeProvider>
          <BrowserRouter>
            <CommandPalette />
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/resume" element={<Resume />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </ThemeProvider>
      </Suspense>
    </QueryClientProvider>
  )
}

export default App
