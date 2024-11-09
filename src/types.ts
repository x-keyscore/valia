/**
 * Loose Autocomplete
 */
export type LooseAutocomplete<T extends string> = T | Omit<string, T>