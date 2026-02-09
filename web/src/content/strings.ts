import stringsData from './strings.json'

export type Strings = typeof stringsData

export const strings: Strings = stringsData

// export const useContent = (): Strings => {
//   return strings
// }