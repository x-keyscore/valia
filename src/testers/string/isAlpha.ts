/**
 * @returns Check if all characters of the string are between A and Z or a and z (%d65-%d90 / %d97-%d122).
 * Empty returns false.
 */
export function isAlpha(str: string, params?: undefined): boolean {
	return (RegExp("^[a-zA-Z]+$").test(str));
}