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

interface UuidOptions {
	/** Specifies the allowed version number, between 1 and 7. */
	version?: 1|2|3|4|5|6|7;
}

const extractUuidVersionRegex = new RegExp("^[0-9A-F]{8}-[0-9A-F]{4}-([1-7])[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$", "i");

/**
 * **Standard :** RFC 9562
 * 
 * @version 1.0.0
 */
export function isUuid(str: string, options?: UuidOptions): boolean {
    if (typeof str !== "string") {
		throw new Error("The 'str' argument must be of type string.");
	}
	if (options !== undefined) {
        if (typeof options !== "object") {
            throw new Error("The 'options' argument must be of type object.");
        }
        if (options?.version !== undefined) {
            if (typeof options.version !== "number") {
                throw new Error("The 'cidr' property of the 'options' argument must be of type number.");
            }
            if (options.version < 1 || options.version > 7) {
                throw new Error("The 'cidr' property of the 'options' argument must be a number between 1 and 7.");
            }
        }
	}

	const execResult = extractUuidVersionRegex.exec(str);
	if (!execResult || !execResult[1]) return (false);
	if (!options?.version || (execResult[1].codePointAt(0)! - 48) === options?.version) return (true);

	return (false);
}