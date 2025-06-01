<<<<<<< HEAD
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
=======
/**
 * DATA URL
 * 
 * Composition :
 * * `ALPHA = %d65-%d90 / %d97-%d122` A-Z / a-z
 * * `DIGIT = %x30-39` 0-9
 * * `token = 1*(DIGIT )
 * * `type = token`
 * * `subtype = token / iana-token`
 * * `parameter = attribute "=" value`
 * * `mediatype = [type "/" subtype] *(";" parameter)`
 * * `dataurl = "data:" [mediatype] [";base64"] "," data`
 */
import { LooseAutocomplete } from "../../types";
import { lazy } from "../utils";

interface ParseDataUrlResult {
>>>>>>> 149b53cfcb46941fa9a61c16c4daabf1bad52060
	data: string;
	type: string;
	subtype: string;
	isBase64: boolean;
	parameters: { name: string, value: string }[];
}

<<<<<<< HEAD
interface DataUrlParams {
	/**
=======
interface IsDataUrlConfig {
	/** 
>>>>>>> 149b53cfcb46941fa9a61c16c4daabf1bad52060
	 * Specifies the type of media.
	 * 
	 * @see http://www.iana.org/assignments/media-types/
	 */
<<<<<<< HEAD
	type: string[];
=======
	type: LooseAutocomplete<"text" | "image" | "audio" | "video" | "application" | "message" | "multipart">[];
>>>>>>> 149b53cfcb46941fa9a61c16c4daabf1bad52060
	/**
	 * Specifies the sub-type of media.
	 * 
	 * @see http://www.iana.org/assignments/media-types/
	 */
	subtype: string[];
}

<<<<<<< HEAD
const paramTokenPattern = "[a-zA-Z0-9!#$%&'*+.^_`{|}~-]+";
const paramTokenQuotePattern = "\"[a-zA-Z0-9!#$%&'()*+,./:;<=>?@\[\\\]^_`{|}~-]+\"";
const valueRegex = new RegExp(`^(?:${paramTokenPattern}|${paramTokenQuotePattern})$`);

const tokenRegex = new RegExp(`^[a-zA-Z0-9](?:[a-zA-Z0-9!#$&^/_.+-]{0,125}[a-zA-Z0-9!#$&^/_.-])?$`);

const dataRegex = new RegExp(`^(?:[a-zA-Z0-9._~!$&'()*+,;=:@-]|%[a-zA-Z0-9]{2})*$`);



function parseDataUrl(str: string): DataUrlObject | null {
	const result: DataUrlObject = {
=======
/** https://datatracker.ietf.org/doc/html/rfc2045#section-5.1 */
const tokenPattern = "[a-zA-Z0-9!#$%&'*+.^_`{|}~-]+";

/** https://datatracker.ietf.org/doc/html/rfc6838#section-4.2 */
const ianaTokenPattern = "(?:[a-zA-Z0-9](?:[+]?[a-zA-Z0-9!#$&^_-][.]?){0,126})";

/** https://datatracker.ietf.org/doc/html/rfc3986#appendix-A */
const dataPattern = "(?:[a-zA-Z0-9-;/?:@&=+$,_.!~*'()]|%[a-zA-Z0-9]{2})*";

const quotedStringPattern = "\"[a-zA-Z0-9!#$%&'()*+,./:;<=>?@\[\\\]^_`{|}~-]+\"";

const dataRegex = new RegExp(`^${dataPattern}$`);
const typeRegex = new RegExp(`^${tokenPattern}$`);
const subtypeRegex = new RegExp(`^(?:${tokenPattern}|${ianaTokenPattern})$`);
const parameterNameRegex = new RegExp(`^${tokenPattern}$`);
const parameterValueRegex = new RegExp(`^(?:${tokenPattern}|${quotedStringPattern})$`);

function parseDataUrl(str: string): ParseDataUrlResult | null {
	const result: ParseDataUrlResult = {
>>>>>>> 149b53cfcb46941fa9a61c16c4daabf1bad52060
		data: "",
		type: "",
		subtype: "",
		parameters: [],
		isBase64: false
	};
	let i = 0;

	if (!str.startsWith("data:")) return (null);
<<<<<<< HEAD
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
=======
	i = 5;

	if (str[i] !== "," && str[i] !== ";") {
		// EXTRACT TYPE
		const startOfType = i;
		while (str[i] && str[i] !== "/") i++;
		if (!str[i]) return (null);
		const endOfType = i;
		result.type = str.slice(startOfType, endOfType);
		if (!typeRegex.test(result.type)) return (null);

		// EXTRACT SUBTYPE
		const startOfSubtype = ++i;
		while (str[i] && str[i] !== ";" && str[i] !== ",") i++;
		if (!str[i]) return (null);
		const endOfSubtype = i;
		result.subtype = str.slice(startOfSubtype, endOfSubtype);
		if (!subtypeRegex.test(result.subtype)) return (null);
	}

	while (str[i] && str[i] === ";") {
		// EXTRACT BASE64 FLAG
		if (str.startsWith(";base64,", i)) {
			result.isBase64 = true;
			i += 8;
			break;
		}

		// EXTRACT PARAMETER NAME
		const startOfName = ++i;
		while (str[i] && str[i] !== "=") i++;
		if (!str[i]) return (null);
		const endOfName = i;

		// EXTRACT PARAMETER VALUE
		const startOfValue = ++i;
		if (str[startOfValue] === "\"") {
>>>>>>> 149b53cfcb46941fa9a61c16c4daabf1bad52060
			while (str[i] && !(str[i - 1] === "\"" && (str[i] === ";" || str[i] === ","))) i++;
		}
		else {
			while (str[i] && str[i] !== ";" && str[i] !== ",") i++;
		}
<<<<<<< HEAD
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
=======
		if (!str[i]) return (null);
		const endOfValue = i;

		const parameter = {
			name: str.slice(startOfName, endOfName),
			value: str.slice(startOfValue, endOfValue)
		}

		if (!parameterNameRegex.test(parameter.name)) return (null);
		if (!parameterValueRegex.test(parameter.value)) return (null);

		result.parameters.push(parameter);
	}
	if (!str[i]) return (null);

	// EXTRACT DATA
	result.data = str.slice(i);
	if (!dataRegex.test(result.data)) return (null);
>>>>>>> 149b53cfcb46941fa9a61c16c4daabf1bad52060

	return (result);
}

<<<<<<< HEAD
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

=======
console.log(parseDataUrl("data:test/subtest;attr=V;base64;base64,poule"))

/**
 * **Standard :** RFC 2397
 * 
 *  @see https://datatracker.ietf.org/doc/html/rfc2397#section-3
 * 
 * **Follows :**
 * `dataurl`
 * 
 * @version 2.0.0-beta
 */
export function isDataUrl(str: string, config?: IsDataUrlConfig): boolean {
	/*
	if (!dataurlRegex().test(str)) return (false);

	if (config?.type || config?.subtype) {
		const [_, type, subtype] = new RegExp("^data:(.*?)\/(.*?)[;|,]").exec(str) as unknown as [string, string, string];

		if (config?.type && !config?.type.includes(type)) return (false);
		if (config?.subtype && !config?.subtype.includes(subtype)) return (false);
	}*/
	return (true);
}
>>>>>>> 149b53cfcb46941fa9a61c16c4daabf1bad52060
