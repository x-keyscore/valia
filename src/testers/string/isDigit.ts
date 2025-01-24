/**
 * @returns Check if all characters of the string are between 0 and 9 (%d48-%d57).
 * Empty returns false.
 */
export function isDigit(str: string, params?: undefined): boolean {
	return (RegExp("^[0-9]+$").test(str));
}