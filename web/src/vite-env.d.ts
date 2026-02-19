/// <reference types="vite/client" />

declare const __BUILD_TIMESTAMP__: string

declare module '*.md' {
  const content: string
  export default content
}

// Fontsource CSS-only imports
declare module '@fontsource-variable/dm-sans' { }
declare module '@fontsource-variable/fraunces' { }
declare module '@fontsource-variable/jetbrains-mono' { }
