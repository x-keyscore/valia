/*
Composition :
    data      = pchar
    value     = value
    token     = restricted-name
    mediatype = [token "/" token] *(";" token "=" value)
    dataurl   = "data:" [mediatype] [";base64"] "," data

Sources :
    RFC 3986 Section 3.3 : pchar
    RFC 2045 Section 5.1 : value
    RFC 6838 Section 4.2 : restricted-name

Links :
    https://datatracker.ietf.org/doc/html/rfc3986#section-3.3
    https://datatracker.ietf.org/doc/html/rfc2045#section-5.1
    https://datatracker.ietf.org/doc/html/rfc6838#section-4.2
    https://datatracker.ietf.org/doc/html/rfc2397#section-3
*/

interface DataUrlObject {
	data: string;
	type: string;
	subtype: string;
	isBase64: boolean;
	parameters: { name: string, value: string }[];
}

interface DataUrlParams {
	/**
	 * Specifies the type of media.
	 * 
	 * @see http://www.iana.org/assignments/media-types/
	 */
	type: string[];
	/**
	 * Specifies the sub-type of media.
	 * 
	 * @see http://www.iana.org/assignments/media-types/
	 */
	subtype: string[];
}

const paramTokenPattern = "[a-zA-Z0-9!#$%&'*+.^_`{|}~-]+";
const paramTokenQuotePattern = "\"[a-zA-Z0-9!#$%&'()*+,./:;<=>?@\[\\\]^_`{|}~-]+\"";
const valueRegex = new RegExp(`^(?:${paramTokenPattern}|${paramTokenQuotePattern})$`);

const tokenRegex = new RegExp(`^[a-zA-Z0-9](?:[a-zA-Z0-9!#$&^/_.+-]{0,125}[a-zA-Z0-9!#$&^/_.-])?$`);

const dataRegex = new RegExp(`^(?:[a-zA-Z0-9._~!$&'()*+,;=:@-]|%[a-zA-Z0-9]{2})*$`);



function parseDataUrl(str: string): DataUrlObject | null {
	const result: DataUrlObject = {
		data: "",
		type: "",
		subtype: "",
		parameters: [],
		isBase64: false
	};
	let i = 0;

	if (!str.startsWith("data:")) return (null);
	i += 5;

	if (str[i] !== ";" && str[i] !== ",") {
		// EXTRACT TYPE
		const typeStart = i;
		while (str[i] && str[i] !== "/") i++;
		if (!str[i] || typeStart === i) return (null);
		const typeEnd = i;

		// EXTRACT SUBTYPE
		const subtypeStart = ++i;
		while (str[i] && str[i] !== ";" && str[i] !== ",") i++;
		if (!str[i] || subtypeStart === i) return (null);
		const subtypeEnd = i;

		result.type = str.slice(typeStart, typeEnd);
		result.subtype = str.slice(subtypeStart, subtypeEnd);
	}

	// EXTRACT PARAMETERS
	while (str[i] && str[i] === ";") {
		if (str.startsWith(";base64,", i)) {
			result.isBase64 = true;
			i += 7;
			break;
		}

		const nameStart = ++i;
		while (str[i] && str[i] !== "=") i++;
		if (!str[i] || nameStart === i) return (null);
		const nameEnd = i;

		const valueStart = ++i;
		if (str[valueStart] === "\"") {
			while (str[i] && !(str[i - 1] === "\"" && (str[i] === ";" || str[i] === ","))) i++;
		}
		else {
			while (str[i] && str[i] !== ";" && str[i] !== ",") i++;
		}
		if (!str[i] || valueStart === i) return (null);
		const valueEnd = i;

		result.parameters.push({
			name: str.slice(nameStart, nameEnd),
			value: str.slice(valueStart, valueEnd)
		});
	}

	if (str[i] !== ",") return (null);
	i += 1;

	// EXTRACT DATA
	if (str[i]) result.data = str.slice(i);

	return (result);
}

/**
 * **Standard :** RFC 2397 (RFC 2045, RFC 6838, RFC 3986)
 * 
 * @version 2.0.0
 */
export function isDataUrl(str: string, params?: DataUrlParams): boolean {
	const dataUrl = parseDataUrl(str);
	if (!dataUrl) return (false);

	if (dataUrl.type || dataUrl.subtype) {
		// CHECK TYPE
		if (!tokenRegex.test(dataUrl.type)) return (false);
		// RFC 6838 4.2: Length restriction
		if (dataUrl.type.length > 127) return (false);

		// CHECK SUBTYPE
		if (!tokenRegex.test(dataUrl.subtype)) return (false);
		// RFC 6838 4.2: Length restriction
		if (dataUrl.subtype.length > 127) return (false);
	}

	// CHECK PARAMETERS
	for (let i = 0; i < dataUrl.parameters.length; i++) {
		const parameter = dataUrl.parameters[i];
		
		if (!tokenRegex.test(parameter.name)) return (false);
		if (!valueRegex.test(parameter.value)) return (false);

		// RFC 6838 4.3: Identical name restriction and case insensitive
		if (dataUrl.parameters.some(({ name }, j) =>
			j !== i && name.toLowerCase() === name.toLowerCase())) return (false);
	}

	// CHECK DATA
	if (!dataRegex.test(dataUrl.data)) return (false);

	if (params?.type) {
		const hasValidType = params.type.some(type => 
			type.toLowerCase() === dataUrl.type.toLowerCase());
		if (!hasValidType) return (false);
	}
	if (params?.subtype) {
		const hasValidSubtype = params.subtype.some(subtype => 
			subtype.toLowerCase() === dataUrl.subtype.toLowerCase());
		if (!hasValidSubtype) return (false);
	}

	return (true);
}

