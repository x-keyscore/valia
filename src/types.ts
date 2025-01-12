/** Loose Autocomplete */
export type LooseAutocomplete<T extends string> = T | Omit<string, T>;

/** Removes index signatures from a list of keys. */
export type OmitIndexSignatures<K extends keyof any> =
	string extends K ? never :
	number extends K ? never :
	symbol extends K ? never :
	K;