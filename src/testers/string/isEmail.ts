import { lazy } from "../utils";
import { isDomain } from "./isDomain";
import { ipV4Pattern, IPv6Pattern } from "./isIp";

interface IsEmailParams {
	/**
	 * **Warning:** Enabling this parameter allows xss attacks
	 * 
	 * **Default:** `false`
	 */
	allowQuotedString?: boolean;
	/** **Default:** `false` */
	allowAddressLiteral?: boolean;
}

const dotStringPattern = "(?:[-!=?A-B\\x23-\\x27\\x2A-\\x2B\\x2F-\\x39\\x5E-\\x7E]+(?:\\.[-!=?A-B\\x23-\\x27\\x2A-\\x2B\\x2F-\\x39\\x5E-\\x7E]+)*)";
const quotedStringPattern = "(?:\"(?:[\\x20-\\x21\\x23-\\x5B\\x5D-\\x7E]|\\\\[\\x20-\\x7E])*\")";

const localPartQuotedRegex = lazy(() => new RegExp(`^(?:${dotStringPattern}|${quotedStringPattern})$`));
const localPartSimpleRegex = new RegExp(`^${dotStringPattern}$`);

//const generalAddrLiteralPattern = "(?:[a-zA-Z0-9-]*[a-zA-Z0-9]+:[\\x21-\\x5A\\x5E-\\x7E]+)";
const domainPartAddressRegex = lazy(() => new RegExp(`^\\[(?:IPv6:${IPv6Pattern}|${ipV4Pattern})\\]$`));

function splitEmail(str: string) {
	const arrayLength = str.length;

	// FIND SYMBOL INDEX
	let i = 0;
	while (i < arrayLength && str[i] !== "@") {
		i++;
	}

	// CHECK SYMBOL CHAR
	if (str[i] !== "@") return (null);

	const symbolIndex = i;

	// CHECK LOCAL LENGTH
	if (!symbolIndex) return (null);

	// CHECK DOMAIN LENGTH
	/** @see https://datatracker.ietf.org/doc/html/rfc5321#section-4.5.3.1.2 */
	const domainLength = arrayLength - (symbolIndex + 1);
	if (!domainLength || domainLength > 255) return (null);

	return {
		local: str.slice(0, symbolIndex),
		domain: str.slice(symbolIndex + 1, arrayLength)
	};
}

function isValidLocalPart(str: string, params?: IsEmailParams): boolean {
	if (localPartSimpleRegex.test(str)) {
		return (true);
	}
	else if (params?.allowQuotedString && localPartQuotedRegex().test(str)) {
		return (true);
	}

	return (false);
}

function isValidDomainPart(str: string, params?: IsEmailParams): boolean {
	if (isDomain(str)) {
		return (true);
	}
	else if (params?.allowAddressLiteral && domainPartAddressRegex().test(str)){
		return (true);
	}

	return (false);
}

/**
 * **Standard :** RFC 5321
 * 
 *  @see https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.2
 * 
 * **Follows :**
 * `Mailbox`
 * 
 * @version 1.0.0-beta
 */
export function isEmail(str: string, params?: IsEmailParams): boolean {
	const parts = splitEmail(str);
	if (!parts) return (false);

	if (
		isValidLocalPart(parts.local, params)
		&& isValidDomainPart(parts.domain, params)
	) return (true);

	return (false);
}