import { stringToUTF16UnitArray } from "../../tools";

/**
 * @see https://datatracker.ietf.org/doc/html/rfc1035#section-2.3.1
 * 
 * * **Follows :**
 * `<letter>`
 */
function isLetter(codePoint: number) {
	// LETTER
	if ((codePoint | 32) >= 97 && (codePoint | 32) <= 122) return (true);

	return (false);
}

/**
 * @see https://datatracker.ietf.org/doc/html/rfc1035#section-2.3.1
 * 
 * * **Follows :**
 * `<digit>`
 */
function isDigit(codePoint: number) {
	// DIGIT
	if (codePoint >= 48 && codePoint <= 57) return (true);

	return (false);
}

/**
 *  @param input Can be either a `string` or a `Uint16Array` containing
 * the decimal values ​​of the string in code point Unicode format.
 * 
 * **Implementation version :** 1.0.0-beta
 * 
 * ==============================
 * 
 * **Standard :** RFC 1035
 * 
 * @see https://datatracker.ietf.org/doc/html/rfc1035#section-2.3.1
 * 
 * **Follows :**
 * `<domain>`
 * 
 * **Checked composition :**
 * * `letter = %d65-%d90 / %d97-%d122` A-Z / a-z
 * * `digit = %x30-39` 0-9
 * * `label = letter [*(digit / letter / "-") digit / letter]`
 * * `domain = label *("." label)`
 */
export function isDomain(input: string | Uint16Array, params?: undefined): boolean {
	const utf16UnitArray = typeof input === "string" ? stringToUTF16UnitArray(input) : input;
	const arrayLength = utf16UnitArray.length;
	let labelLength = 0;
	let prevIsDot = 1;
	let prevIsHyp = 0;
	let i = 0;

	while (i < arrayLength) {
		const code = utf16UnitArray[i];

		if (labelLength > 63) return (false);

		if (code === 46) {// "."
			if (prevIsDot || prevIsHyp) return (false);
			prevIsDot = 1;
		} else if (code === 45) {// "-"
			if (prevIsDot) return (false);
			prevIsHyp = 1;
			labelLength++;
		} else if (isDigit(code)) {
			if (prevIsDot) return (false);
			prevIsHyp = 0;
			labelLength++;
		} else if (isLetter(code)) {
			prevIsDot = 0;
			prevIsHyp = 0;
			labelLength++;
		} else {
			return (false);
		}

		i++;
	}

	if (prevIsDot || prevIsHyp) return (false);

	return (true);
}