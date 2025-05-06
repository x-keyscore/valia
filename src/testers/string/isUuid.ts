interface IsUuidParams {
	/** **Default:** All version validate */
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
export function isUuid(str: string, params?: IsUuidParams): boolean {
	const extracted = extractUuidVersionRegex.exec(str);
	if (!extracted || !extracted[1]) return (false);
	if (!params?.version || (extracted[1].codePointAt(0)! - 48) === params?.version) return (true);

	return (false);
}