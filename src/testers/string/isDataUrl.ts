import { LooseAutocomplete } from "../../types";
import { lazy } from "../utils";

interface IsDataUrlParams {
	/**
	 * Specifies the type of media, corresponding to the **image** type in the example.
	 * 
	 * **Exemple:** data:**image**\/gif;base64,R0lGODdhMA
	 */
	type?: LooseAutocomplete<"text"|"image"|"audio"|"video"|"application"|"message"|"multipart">;
	/**
	 * Specifies the sub-type of media, corresponding to the **gif** sub-type in the example.
	 * 
	 * **Exemple:** data:image/**gif**;base64,R0lGODdhMA
	 */
	subtype?: string[];
}

/** @see https://datatracker.ietf.org/doc/html/rfc6838#section-4.2 */
const ianaTokenPattern = "(?:[a-zA-Z0-9](?:[+]?[a-zA-Z0-9!#$&^_-][.]?){0,126})";
const discreteTypePattern = "(?:text|image|application|audio|video|message|multipart)";
const parameterPattern = "[-!*+.0-9A-Z\\x23-\\x27\\x5E-\\x7E]+=(?:[-!*+.0-9A-Z\\x23-\\x27\\x5E-\\x7E]+|\"(?:[^\\\"\\x13]|\\\\[\\x00-\\x7F])+\")";
const mediatypePattern = `${discreteTypePattern}\\/${ianaTokenPattern}(?:;${parameterPattern})*`;

const contentPattern = "(?:[a-zA-Z0-9-;/?:@&=+$,_.!~*'()]|%[a-zA-Z0-9]{2})*";

const dataUrlRegex = lazy(() => new RegExp(`^data:(?:${mediatypePattern})?(?:;base64)?,${contentPattern}$`));

/**
 * **Standard :** RFC 2397
 * 
 *  @see https://datatracker.ietf.org/doc/html/rfc2397#section-3
 * 
 * **Follows :**
 * `dataurl`
 * 
 * @version 1.0.0-beta
 */
export function isDataUrl(str: string, params?: IsDataUrlParams): boolean {
	if (!dataUrlRegex().test(str)) return (false);

	if (params?.type || params?.subtype) {
		const [_, type, subtype] = new RegExp("^data:(.*?)\/(.*?)[;|,]").exec(str) as unknown as [string, string, string];

		if (params?.type && params.type !== type) return (false);
		if (params?.subtype && !params?.subtype.includes(subtype)) return (false);
	}
	return (true);
}