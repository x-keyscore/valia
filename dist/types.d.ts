/**
 * Loose Autocomplete
 */
export type LooseAutocomplete<T extends string> = T | Omit<string, T>;
export type EmptyObject = Record<PropertyKey, never>;
