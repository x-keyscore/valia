/**
# IPV4

Composition :
    dec-octet = 1*3DIGIT ; Representing a decimal integer value in the range 0 through 255
    suffixe    = 1*2DIGIT ; Representing a decimal integer value in the range 0 through 32.
    IPv4      = dec-octet 3("." dec-octet) ["/" suffixe]

# IPV6

Composition :
    HEXDIG      = DIGIT / A-F / a-f
    IPv6-full   = 1*4HEXDIG 7(":" 1*4HEXDIG)
    IPv6-comp   = [1*4HEXDIG *5(":" 1*4HEXDIG)] "::" [1*4HEXDIG *5(":" 1*4HEXDIG)]
    IPv6v4-full = 1*4HEXDIG 5(":" 1*4HEXDIG) ":" IPv4
    IPv6v4-comp = [1*4HEXDIG *3(":" 1*4HEXDIG)] "::" [1*4HEXDIG *3(":" 1*4HEXDIG) ":"] IPv4
    suffixe      = 1*3DIGIT ; Representing a decimal integer value in the range 0 through 128.
    IPv6        = (IPv6-full / IPv6-comp / IPv6v4-full / IPv6v4-comp) ["/" suffixe]
*/

import { weakly } from "../utils";

interface IpOptions {
	/**
	 * Defines the expected behavior for a CIDR suffix.
	 * - `"reject"` : CIDR is rejected (ex: `"192.168.0.1"` true, `"192.168.0.1/24"` false)
	 * - `"accept"` : CIDR is accepted (ex: `"192.168.0.1"` true, `"192.168.0.1/24"` true)
	 * - `"expect"` : CIDR is expected (ex: `"192.168.0.1"` false, `"192.168.0.1/24"` true)
	 * 
	 * **Default:** `"reject"`
	 */
	cidr?: "reject" | "accept" | "expect";
}

const ipV4Seg = "(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])";
export const ipV4Pattern = `(?:${ipV4Seg}\\.){3}${ipV4Seg}`;

const ipV4Regex = new RegExp(`^${ipV4Pattern}$`);
const ipV4WithCidrExpectedRegex = weakly(() =>new RegExp(`^${ipV4Pattern}/(3[0-2]|[12]?[0-9])$`));
const ipV4WithCidrAcceptedRegex = weakly(() =>new RegExp(`^${ipV4Pattern}(?:/(3[0-2]|[12]?[0-9]))?$`));

const ipV6Seg = "(?:[0-9a-fA-F]{1,4})";
export const ipV6Pattern = "(?:" +
	`(?:${ipV6Seg}:){7}(?:${ipV6Seg}|:)|` +
	`(?:${ipV6Seg}:){6}(?:${ipV4Pattern}|:${ipV6Seg}|:)|` +
	`(?:${ipV6Seg}:){5}(?::${ipV4Pattern}|(?::${ipV6Seg}){1,2}|:)|` +
	`(?:${ipV6Seg}:){4}(?:(?::${ipV6Seg}){0,1}:${ipV4Pattern}|(?::${ipV6Seg}){1,3}|:)|` +
	`(?:${ipV6Seg}:){3}(?:(?::${ipV6Seg}){0,2}:${ipV4Pattern}|(?::${ipV6Seg}){1,4}|:)|` +
	`(?:${ipV6Seg}:){2}(?:(?::${ipV6Seg}){0,3}:${ipV4Pattern}|(?::${ipV6Seg}){1,5}|:)|` +
	`(?:${ipV6Seg}:){1}(?:(?::${ipV6Seg}){0,4}:${ipV4Pattern}|(?::${ipV6Seg}){1,6}|:)|` +
	`(?::(?:(?::${ipV6Seg}){0,5}:${ipV4Pattern}|(?::${ipV6Seg}){1,7}|:)))`;

const ipV6Regex = new RegExp(`^${ipV6Pattern}$`);
const ipV6WithCidrExpectedRegex = weakly(() =>new RegExp(`^${ipV6Pattern}/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$`));
const ipV6WithCidrAcceptedRegex = weakly(() =>new RegExp(`^${ipV6Pattern}(?:/(12[0-8]|1[01][0-9]|[1-9]?[0-9]))?$`));

function checkArguments(str: string, options?: IpOptions) {
	if (typeof str !== "string") {
		throw new Error("The 'str' argument must be of type string.");
	}
	if (options !== undefined) {
		if (typeof options !== "object") {
			throw new Error("The 'options' argument must be of type object.");
		}
		if (options.cidr !== undefined && typeof options.cidr !== "string") {
			throw new Error("The 'cidr' property of the 'options' argument must be of type string.");
		}
	}
}

/**
 * **Standard:** No standard
 * 
 * @version 2.0.0
 */
export function isIp(str: string, options?: IpOptions): boolean {
	checkArguments(str, options);

	if (options?.cidr === undefined || options.cidr === "reject") {
		if (ipV4Regex.test(str)) return (true);
		if (ipV6Regex.test(str)) return (true);
	}
	else if (options.cidr === "expect") {
		if (ipV4WithCidrExpectedRegex().test(str)) return (true);
		if (ipV6WithCidrExpectedRegex().test(str)) return (true);
	}
	else if (options.cidr === "accept") {
		if (ipV4WithCidrAcceptedRegex().test(str)) return (true);
		if (ipV6WithCidrAcceptedRegex().test(str)) return (true);
	}
	else {
		throw new Error("The 'options.cidr' property must be a known string.");
	}

	return (false);
}

/**
 * **Standard:** No standard
 * 
 * @version 2.0.0
 */
export function isIpV4(str: string, options?: IpOptions): boolean {
	checkArguments(str, options);

	if (options?.cidr === undefined || options.cidr === "reject") {
		if (ipV4Regex.test(str)) return (true);
	}
	else if (options.cidr === "expect") {
		if (ipV4WithCidrExpectedRegex().test(str)) return (true);
	}
	else if (options.cidr === "accept") {
		if (ipV4WithCidrAcceptedRegex().test(str)) return (true);
	}
	else {
		throw new Error("The 'options.cidr' property must be a known string.");
	}

	return (false);
}

/**
 * **Standard:** No standard
 * 
 * @version 2.0.0
 */
export function isIpV6(str: string, options?: IpOptions): boolean {
	checkArguments(str, options);

	if (options?.cidr === undefined || options.cidr === "reject") {
		if (ipV6Regex.test(str)) return (true);
	}
	else if (options.cidr === "expect") {
		if (ipV6WithCidrExpectedRegex().test(str)) return (true);
	}
	else if (options.cidr === "accept") {
		if (ipV6WithCidrAcceptedRegex().test(str)) return (true);
	}
	else {
		throw new Error("The 'options.cidr' property must be a known string.");
	}

	return (false);
}