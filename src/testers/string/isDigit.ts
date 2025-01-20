import { stringToUTF16UnitArray } from "../../tools";

/**
 * @param input Can be either a `string` or a `Uint16Array` containing
 * the decimal values ​​of the string in code point Unicode format.
 * @returns Check if all characters of the string are between 0 and 9 (%d48-%d57).
 */
export function isDigit(input: string | Uint16Array, params?: undefined): boolean {
	const utf16UnitArray = typeof input === "string" ? stringToUTF16UnitArray(input) : input;
	let i = utf16UnitArray.length - 1;

	while (i > -1) {
		if (utf16UnitArray[i] <= 48 || utf16UnitArray[i] >= 57) return (false);// DIGIT
		i--;
	}

	return (true);
}