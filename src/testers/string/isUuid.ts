/*
Composition :
    DIGIT    = %x30-39
    HEXDIG   = DIGIT / "A" / "B" / "C" / "D" / "E" / "F"
    hexOctet = HEXDIG HEXDIG
    uuid     = 4*4hexOctet "-"
               2*2hexOctet "-"
               2*2hexOctet "-"
               2*2hexOctet "-"
               6*6hexOctet

Sources :
    RFC 9562 Section 4 : DIGIT
                         HEXDIG
                         hexOctet
                         UUID -> uuid

Links :
    https://datatracker.ietf.org/doc/html/rfc9562#section-4
*/

interface UuidParams {
	/** **Default:** All versions are allowed */
	version?: 1|2|3|4|5|6|7;
}

const extractUuidVersionRegex = new RegExp("^[0-9A-F]{8}-[0-9A-F]{4}-([1-7])[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$", "i");

/**
 * **Standard :** RFC 9562
 * 
 * @see https://datatracker.ietf.org/doc/html/rfc9562#section-4
 * 
 * @version 1.0.0
 */
export function isUuid(str: string, params?: UuidParams): boolean {
	const extracted = extractUuidVersionRegex.exec(str);
	if (!extracted || !extracted[1]) return (false);
	if (!params?.version || (extracted[1].codePointAt(0)! - 48) === params?.version) return (true);

	return (false);
}