/*
Composition :
    atom            = 1*atext
    dot-local       = atom *("."  atom)
    quoted-local    = DQUOTE *QcontentSMTP DQUOTE
    ip-address      = IPv4-address-literal / IPv6-address-literal
    general-address = General-address-literal
    local           = dot-local / quote-local
    domain          = Domain
    address         = ip-address / general-address
    mailbox         = local "@" (domain / address)

Sources :
    RFC 5234 Appendix B.1   : DQUOTE
    RFC 5322 Section  3.2.3 : atext
    RFC 5321 Section  4.1.3 : IPv4-address-literal
                              IPv6-address-literal
                              General-address-literal
    RFC 5321 Section  4.1.2 : QcontentSMTP
                              Domain

Links :
    https://datatracker.ietf.org/doc/html/rfc5234#appendix-B.1
    https://datatracker.ietf.org/doc/html/rfc5322#section-3.2.3
    https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.3
    https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.2
*/

import { ipV4Pattern, ipV6Pattern } from "./isIp";
import { isDomain } from "./isDomain";
import { weakly } from "../utils";

interface EmailObject {
	local: string;
	domain: string;
}

interface EmailOptions {
	/** **Default:** `false` */
	allowLocalQuote?: boolean;
	/** **Default:** `false` */
	allowIpAddress?: boolean;
	/** **Default:** `false` */
	allowGeneralAddress?: boolean;
}

const localDotPattern = "(?:[-!=?A-B\\x23-\\x27\\x2A-\\x2B\\x2F-\\x39\\x5E-\\x7E]+(?:\\.[-!=?A-B\\x23-\\x27\\x2A-\\x2B\\x2F-\\x39\\x5E-\\x7E]+)*)";
const localQuotePattern = "(?:\"(?:[\\x20-\\x21\\x23-\\x5B\\x5D-\\x7E]|\\\\[\\x20-\\x7E])*\")";

const localDotRegex = new RegExp(`^${localDotPattern}$`);
const localDotOrLocalQuoteRegex = weakly(() => new RegExp(`^(?:${localDotPattern}|${localQuotePattern})$`));

const ipAddressRegex = weakly(() => new RegExp(`^\\[(?:IPv6:${ipV6Pattern}|${ipV4Pattern})\\]$`));
const generalAddressRegex = weakly(() => new RegExp(`(?:[a-zA-Z0-9-]*[a-zA-Z0-9]+:[\\x21-\\x5A\\x5E-\\x7E]+)`));

function parseEmail(str: string): EmailObject | null {
	const length = str.length;
	let i = 0;

	// EXTRACT LOCAL
	const localStart = i;
	if (str[localStart] === "\"") {
		while (++i < length) {
			if (str[i] === "\\") i++;
			else if (str[i] === "\"") {
				i++;
				break;
			}
		}
	} else {
		while (i < length && str[i] !== "@") i++;
	}
	if (i === localStart || str[i] !== "@") return (null);
	const localEnd = i;

	// EXTRACT DOMAIN
	const domainStart = ++i;
	const domainEnd = length;
	if (domainStart === domainEnd) return (null);

	return ({
		local: str.slice(localStart, localEnd),
		domain: str.slice(domainStart, domainEnd)
	});
}

function validateLocal(str: string, options?: EmailOptions): boolean {
	if (localDotRegex.test(str)) return (true);

	if (options?.allowLocalQuote
		&& localDotOrLocalQuoteRegex().test(str)) return (true);

	return (false);
}

function validateDomain(str: string, options?: EmailOptions): boolean {
	if (isDomain(str)) return (true);

	if (options?.allowIpAddress
		&& ipAddressRegex().test(str)) return (true);
	if (options?.allowGeneralAddress
		&& generalAddressRegex().test(str)) return (true);
	
	return (false);
}

/**
 * **Standard :** RFC 5321
 * 
 * @version 2.0.0
 */
export function isEmail(str: string, options?: EmailOptions): boolean {
	if (typeof str !== "string") {
		throw new Error("The 'str' argument must be of type string.");
	}
	if (options !== undefined) {
		if (typeof options !== "object") {
			throw new Error("The 'options' argument must be of type object.");
		}
		if (options.allowLocalQuote !== undefined && typeof options.allowLocalQuote !== "boolean") {
			throw new Error("The 'allowLocalQuote' property of the 'options' argument must be of type boolean.");
		}
		if (options.allowIpAddress !== undefined && typeof options.allowIpAddress !== "boolean") {
			throw new Error("The 'allowIpAddress' property of the 'options' argument must be of type boolean.");
		}
		if (options.allowGeneralAddress !== undefined && typeof options.allowGeneralAddress !== "boolean") {
			throw new Error("The 'allowGeneralAddress' property of the 'options' argument must be of type boolean.");
		}
	}

	const email = parseEmail(str);
	if (!email) return (false);

	// VALIDATE LOCAL
	if (!validateLocal(email.local, options)) return (false);

	// VALIDATE DOMAIN
	if (!validateDomain(email.domain, options)) return (false);

	// RFC 5321 4.5.3.1.2 : Length restriction
	if (!email.domain.length || email.domain.length > 255) return (false);

	return (true);
}