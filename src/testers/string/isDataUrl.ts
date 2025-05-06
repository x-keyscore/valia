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
	data: string;
	type: string;
	subtype: string;
	isBase64: boolean;
	parameters: { name: string, value: string }[];
}

interface IsDataUrlConfig {
	/** 
	 * Specifies the type of media.
	 * 
	 * @see http://www.iana.org/assignments/media-types/
	 */
	type: LooseAutocomplete<"text" | "image" | "audio" | "video" | "application" | "message" | "multipart">[];
	/**
	 * Specifies the sub-type of media.
	 * 
	 * @see http://www.iana.org/assignments/media-types/
	 */
	subtype: string[];
}

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
		data: "",
		type: "",
		subtype: "",
		parameters: [],
		isBase64: false
	};
	let i = 0;

	if (!str.startsWith("data:")) return (null);
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
			while (str[i] && !(str[i - 1] === "\"" && (str[i] === ";" || str[i] === ","))) i++;
		}
		else {
			while (str[i] && str[i] !== ";" && str[i] !== ",") i++;
		}
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

	return (result);
}

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