/// <reference types="vite/client" />

declare const __BUILD_TIMESTAMP__: string

declare module '*.md' {
  const content: string
  export default content
}
