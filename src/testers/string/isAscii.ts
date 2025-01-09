import { createUTF16UnitArray } from "../../tools";

/**
 * @param input Can be either a `string` or a `Uint16Array` containing the decimal values ​​of the string in code point Unicode format.
 * @returns `true` if all characters in the string are in the ascii table (%d0-%d127) otherwise `false`.
 */
export function isAscii(input: string | Uint16Array, params?: undefined): boolean {
	const utf16UnitArray = typeof input === "string" ? createUTF16UnitArray(input) : input;
	let i = utf16UnitArray.length - 1;

	while (i > -1 && (utf16UnitArray[i] & 0x80) === 0) {
		i--;
	}

    return (i === -1);
}