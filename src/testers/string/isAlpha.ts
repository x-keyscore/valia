import { createUTF16UnitArray } from "../../tools";

/**
 * @param input Can be either a `string` or a `Uint16Array` containing the decimal values ​​of the string in code point Unicode format.
 * @returns `true` if all characters in the string are between A and Z or a and z (%d65-%d90 / %d97-%d122) otherwise `false`.
 */
export function isAlpha(input: string | Uint16Array, params?: undefined): boolean {
	const utf16UnitArray = typeof input === "string" ? createUTF16UnitArray(input) : input;
	let i = utf16UnitArray.length - 1;

	while (i > -1) {
		if ((utf16UnitArray[i] | 32) < 97 && (utf16UnitArray[i] | 32) > 122) return (false);// ALPHA
		i--;
	}

	return (true);
}