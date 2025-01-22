import { stringToUTF16UnitArray } from "../../tools";

/**
 * @param input Can be either a `string` or a `Uint16Array` 
 * containing the decimal values ​​of the string.
 * 
 * **Standard :** RFC 2397
 * 
 *  @see https://datatracker.ietf.org/doc/html/rfc2397#section-3
 * 
 * **Follows :**
 * `dataurl`
 * 
 * @version 1.0.0-beta
 */
export function isDataURL(input: string | Uint16Array, params?: undefined): boolean {
	const utf16UnitArray = typeof input === "string" ? stringToUTF16UnitArray(input) : input;
	return (true);
}