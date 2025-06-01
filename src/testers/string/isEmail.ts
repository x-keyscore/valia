<<<<<<< HEAD
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

import { weak } from "../utils";
import { isDomain } from "./isDomain";
import { ipV4Pattern, ipV6Pattern } from "./isIp";

interface EmailObject {
	local: string;
	domain: string;
}

interface EmailParams {
	/** **Default:** `false` */
	allowQuotedString?: boolean;
	/** **Default:** `false` */
	allowIpAddress?: boolean;
	/** **Default:** `false` */
	allowGeneralAddress?: boolean;
=======
import { lazy } from "../utils";
import { isDomain } from "./isDomain";
import { ipV4Pattern, IPv6Pattern } from "./isIp";

interface IsEmailParams {
	/** **Default:** `false` */
	allowQuotedString?: boolean;
	/** **Default:** `false` */
	allowAddressLiteral?: boolean;
	/** **Default:** `false` */
	allowGeneralAddressLiteral?: boolean;
>>>>>>> 149b53cfcb46941fa9a61c16c4daabf1bad52060
}

const dotStringPattern = "(?:[-!=?A-B\\x23-\\x27\\x2A-\\x2B\\x2F-\\x39\\x5E-\\x7E]+(?:\\.[-!=?A-B\\x23-\\x27\\x2A-\\x2B\\x2F-\\x39\\x5E-\\x7E]+)*)";
const quotedStringPattern = "(?:\"(?:[\\x20-\\x21\\x23-\\x5B\\x5D-\\x7E]|\\\\[\\x20-\\x7E])*\")";

<<<<<<< HEAD
const dotLocalRegex = new RegExp(`^${dotStringPattern}$`);
const dotOrQuoteLocalRegex = weak(() => new RegExp(`^(?:${dotStringPattern}|${quotedStringPattern})$`));

const ipAddressRegex = weak(() => new RegExp(`^\\[(?:IPv6:${ipV6Pattern}|${ipV4Pattern})\\]$`));
const generalAddressRegex = weak(() => new RegExp(`(?:[a-zA-Z0-9-]*[a-zA-Z0-9]+:[\\x21-\\x5A\\x5E-\\x7E]+)`));

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

function isValidLocal(str: string, params?: EmailParams): boolean {
	if (dotLocalRegex.test(str)) return (true);

	if (params?.allowQuotedString
		&& dotOrQuoteLocalRegex().test(str)) return (true);
=======
const localPartSimpleRegex = new RegExp(`^${dotStringPattern}$`);
const localPartQuotedRegex = lazy(() => new RegExp(`^(?:${dotStringPattern}|${quotedStringPattern})$`));

const domainPartAddrLiteralRegex = lazy(() => new RegExp(`^\\[(?:IPv6:${IPv6Pattern}|${ipV4Pattern})\\]$`));
const domainPartGeneralAddrLiteralRegex = lazy(() => new RegExp(`(?:[a-zA-Z0-9-]*[a-zA-Z0-9]+:[\\x21-\\x5A\\x5E-\\x7E]+)`));

function splitEmail(str: string) {
	const arrayLength = str.length;

	// FIND SYMBOL INDEX
	// /!\ Starts from the end because the local part allows "@" in quoted strings.
	let i = arrayLength - 1;
	while (i >= 0 && str[i] !== "@") {
		i--;
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
>>>>>>> 149b53cfcb46941fa9a61c16c4daabf1bad52060

	return (false);
}

<<<<<<< HEAD
function isValidDomain(str: string, params?: EmailParams): boolean {
	if (isDomain(str)) return (true);

	if (params?.allowIpAddress
		&& ipAddressRegex().test(str)) return (true);
	if (params?.allowGeneralAddress
		&& generalAddressRegex().test(str)) return (true);
	
=======
function isValidDomainPart(str: string, params?: IsEmailParams): boolean {
	if (isDomain(str)) return (true);

	if (params?.allowAddressLiteral
		&& domainPartAddrLiteralRegex().test(str)) return (true);
	if (params?.allowGeneralAddressLiteral
		&& domainPartGeneralAddrLiteralRegex().test(str)) return (true);

>>>>>>> 149b53cfcb46941fa9a61c16c4daabf1bad52060
	return (false);
}

/**
 * **Standard :** RFC 5321
 * 
<<<<<<< HEAD
 * @version 2.0.0
 */
export function isEmail(str: string, params?: EmailParams): boolean {
	const email = parseEmail(str);
	if (!email) return (false);

	// CHECK LOCAL
	if (!isValidLocal(email.local, params)) return (false);

	// CHECK DOMAIN
	if (!isValidDomain(email.domain, params)) return (false);
	
	// RFC 5321 4.5.3.1.2 : Length restriction
	if (!email.domain.length || email.domain.length > 255) return (false);

	return (true);
=======
 *  @see https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.2
 * 
 * **Follows :**
 * `Mailbox`
 * 
 * @version 1.1.0-beta
 */
export function isEmail(str: string, params?: IsEmailParams): boolean {
	const parts = splitEmail(str);
	if (!parts) return (false);

	if (
		isValidLocalPart(parts.local, params)
		&& isValidDomainPart(parts.domain, params)
	) return (true);

	return (false);
>>>>>>> 149b53cfcb46941fa9a61c16c4daabf1bad52060
}