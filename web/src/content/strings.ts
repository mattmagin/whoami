import stringsData from './strings.json'

// Type is automatically inferred from the JSON structure
export type Strings = typeof stringsData

// Export the strings object directly for simple access
export const strings: Strings = stringsData

// Hook for components (just returns the strings, but allows for future enhancements)
export const useStrings = (): Strings => {
  return strings
}

// Helper function for string interpolation
// Usage: interpolate("Hello, {name}!", { name: "World" }) => "Hello, World!"
export const interpolate = (
  template: string,
  values: Record<string, string | number>
): string => {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return values[key]?.toString() ?? `{${key}}`
  })
}
