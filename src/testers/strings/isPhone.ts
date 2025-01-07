import { createUTF16UnitArray } from "../../tools";

/**
 * @param input Can be either a `string` or a `Uint16Array` containing the decimal values ​​of the string in code point Unicode format.
 * 
 * **Implementation version :** 1.0.0-beta
 * 
 * ==============================
 * 
 * **Standard :** ITU-T E.164
 * 
 *  @see https://www.itu.int/rec/t-rec-e.164/fr
 */
export function isPhone(input: string | Uint16Array, params?: never) {
	const utf16UnitArray = typeof input === "string" ? createUTF16UnitArray(input) : input;
}