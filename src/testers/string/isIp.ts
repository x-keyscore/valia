/**
<<<<<<< HEAD
# IPV4

Composition :
    dec-octet = 1*3DIGIT ; Representing a decimal integer value in the range 0 through 255
    prefix    = 1*2DIGIT ; Representing a decimal integer value in the range 0 through 32.
    IPv4      = dec-octet 3("." dec-octet) ["/" prefix]

# IPV6

Composition :
    HEXDIG      = DIGIT / A-F / a-f
    IPv6-full   = 1*4HEXDIG 7(":" 1*4HEXDIG)
    IPv6-comp   = [1*4HEXDIG *5(":" 1*4HEXDIG)] "::" [1*4HEXDIG *5(":" 1*4HEXDIG)]
    IPv6v4-full = 1*4HEXDIG 5(":" 1*4HEXDIG) ":" IPv4
    IPv6v4-comp = [1*4HEXDIG *3(":" 1*4HEXDIG)] "::" [1*4HEXDIG *3(":" 1*4HEXDIG) ":"] IPv4
    prefix      = 1*3DIGIT ; Representing a decimal integer value in the range 0 through 128.
    IPv6        = (IPv6-full / IPv6-comp / IPv6v4-full / IPv6v4-comp) ["/" prefix]
*/

import { weak } from "../utils";

interface IpParams {
	/**
	 * Allow prefixes at the end of IP addresses (e.g., `192.168.0.1/22`).
	 * 
	 * 
	 * **Default:** `false`
	 */
	allowPrefix?: boolean;
=======
 * IPV4
 * 
 * Composition :
 * * "DIGIT = %x30-39" 0-9.
 * * "dec-octet = 1*3DIGIT" Representing a decimal integer value in the range 0 through 255.
 * * "prefix = 1*2DIGIT" Representing a decimal integer value in the range 0 through 32.
 * * "IPv4 = dec-octet 3("." dec-octet) ["/" prefix]"
 * 
 * IPV6
 * 
 * Composition :
 * * "DIGIT = %x30-39" 0-9.
 * * "HEXDIG = DIGIT / A-F / a-f"
 * * "IPv6-full = 1*4HEXDIG 7(":" 1*4HEXDIG)"
 * * "IPv6-comp = [1*4HEXDIG *5(":" 1*4HEXDIG)] "::" [1*4HEXDIG *5(":" 1*4HEXDIG)]"
 * * "IPv6v4-full = 1*4HEXDIG 5(":" 1*4HEXDIG) ":" IPv4"
 * * "IPv6v4-comp = [1*4HEXDIG *3(":" 1*4HEXDIG)] "::" [1*4HEXDIG *3(":" 1*4HEXDIG) ":"] IPv4"
 * * "prefix = 1*3DIGIT" Representing a decimal integer value in the range 0 through 128.
 * * "IPv6 = (IPv6-full / IPv6-comp / IPv6v4-full / IPv6v4-comp) ["/" prefix]"
 */

//https://datatracker.ietf.org/doc/html/rfc9110#section-8.3.1 see for norming

import { lazy } from "../utils";

interface IsIpParams {
	/**
	 * Must have a prefix at the end of the IP address indicating the subnet mask
	 * (e.g., `192.168.0.1/22`).
	 * 
	 * **Default:** `false`
	 */
	prefix?: boolean;
>>>>>>> 149b53cfcb46941fa9a61c16c4daabf1bad52060
}

const ipV4Seg = "(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])";
export const ipV4Pattern = `(?:${ipV4Seg}\\.){3}${ipV4Seg}`;

const ipV4SimpleRegex = new RegExp(`^${ipV4Pattern}$`);
<<<<<<< HEAD
const ipV4PrefixRegex = weak(() =>new RegExp(`^${ipV4Pattern}/(3[0-2]|[12]?[0-9])$`));

const ipV6Seg = "(?:[0-9a-fA-F]{1,4})";
export const ipV6Pattern = "(?:" +
=======
const ipV4PrefixRegex = lazy(() =>new RegExp(`^${ipV4Pattern}/(3[0-2]|[12]?[0-9])$`));

const ipV6Seg = "(?:[0-9a-fA-F]{1,4})";
export const IPv6Pattern = "(?:" +
>>>>>>> 149b53cfcb46941fa9a61c16c4daabf1bad52060
	`(?:${ipV6Seg}:){7}(?:${ipV6Seg}|:)|` +
	`(?:${ipV6Seg}:){6}(?:${ipV4Pattern}|:${ipV6Seg}|:)|` +
	`(?:${ipV6Seg}:){5}(?::${ipV4Pattern}|(?::${ipV6Seg}){1,2}|:)|` +
	`(?:${ipV6Seg}:){4}(?:(?::${ipV6Seg}){0,1}:${ipV4Pattern}|(?::${ipV6Seg}){1,3}|:)|` +
	`(?:${ipV6Seg}:){3}(?:(?::${ipV6Seg}){0,2}:${ipV4Pattern}|(?::${ipV6Seg}){1,4}|:)|` +
	`(?:${ipV6Seg}:){2}(?:(?::${ipV6Seg}){0,3}:${ipV4Pattern}|(?::${ipV6Seg}){1,5}|:)|` +
	`(?:${ipV6Seg}:){1}(?:(?::${ipV6Seg}){0,4}:${ipV4Pattern}|(?::${ipV6Seg}){1,6}|:)|` +
	`(?::(?:(?::${ipV6Seg}){0,5}:${ipV4Pattern}|(?::${ipV6Seg}){1,7}|:)))`;

<<<<<<< HEAD
const ipV6SimpleRegex = new RegExp(`^${ipV6Pattern}$`);
const ipV6PrefixRegex = weak(() =>new RegExp(`^${ipV6Pattern}/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$`));
=======
const ipV6SimpleRegex = new RegExp(`^${IPv6Pattern}$`);
const ipV6PrefixRegex = lazy(() =>new RegExp(`^${IPv6Pattern}/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$`));

>>>>>>> 149b53cfcb46941fa9a61c16c4daabf1bad52060

/**
 * **Standard:** No standard
 * 
 * @version 1.0.0
 */
<<<<<<< HEAD
export function isIp(str: string, params?: IpParams): boolean {
	if (!params?.allowPrefix && ipV4SimpleRegex.test(str)) return (true);
	else if (params?.allowPrefix && ipV4PrefixRegex().test(str)) return (true);

	if (!params?.allowPrefix && ipV6SimpleRegex.test(str)) return (true);
	else if (params?.allowPrefix && ipV6PrefixRegex().test(str)) return (true);
=======
export function isIp(str: string, params?: IsIpParams): boolean {
	if (!params?.prefix && ipV4SimpleRegex.test(str)) return (true);
	else if (params?.prefix && ipV4PrefixRegex().test(str)) return (true);

	if (!params?.prefix && ipV6SimpleRegex.test(str)) return (true);
	else if (params?.prefix && ipV6PrefixRegex().test(str)) return (true);
>>>>>>> 149b53cfcb46941fa9a61c16c4daabf1bad52060

	return (false);
}

/**
 * **Standard:** No standard
 * 
 * @version 1.0.0
 */
<<<<<<< HEAD
export function isIpV4(str: string, params?: IpParams): boolean {
	if (!params?.allowPrefix && ipV4SimpleRegex.test(str)) return (true);
	else if (params?.allowPrefix && ipV4PrefixRegex().test(str)) return (true);
=======
export function isIpV4(str: string, params?: IsIpParams): boolean {
	if (!params?.prefix && ipV4SimpleRegex.test(str)) return (true);
	else if (params?.prefix && ipV4PrefixRegex().test(str)) return (true);
>>>>>>> 149b53cfcb46941fa9a61c16c4daabf1bad52060

	return (false);
}

/**
 * **Standard:** No standard
 * 
 * @version 1.0.0
 */
<<<<<<< HEAD
export function isIpV6(str: string, params?: IpParams): boolean {
	if (!params?.allowPrefix && ipV4SimpleRegex.test(str)) return (true);
	else if (params?.allowPrefix && ipV4PrefixRegex().test(str)) return (true);
=======
export function isIpV6(str: string, params?: IsIpParams): boolean {
	if (!params?.prefix && ipV4SimpleRegex.test(str)) return (true);
	else if (params?.prefix && ipV4PrefixRegex().test(str)) return (true);
>>>>>>> 149b53cfcb46941fa9a61c16c4daabf1bad52060

	return (false);
}