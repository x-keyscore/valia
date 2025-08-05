import { weakly } from "../utils";

const base16Regex = new RegExp("^(?:[A-F0-9]{2})*$");

const base32Regex = new RegExp("^(?:[A-Z2-7]{8})*(?:[A-Z2-7]{2}[=]{6}|[A-Z2-7]{4}[=]{4}|[A-Z2-7]{5}[=]{3}|[A-Z2-7]{6}[=]{2}|[A-Z2-7]{7}[=]{1})?$");
const base32HexRegex = weakly(() => new RegExp("^(?:[0-9A-V]{8})*(?:[0-9A-V]{2}[=]{6}|[0-9A-V]{4}[=]{4}|[0-9A-V]{5}[=]{3}|[0-9A-V]{6}[=]{2}|[0-9A-V]{7}[=]{1})?$"));

const base64Regex = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}[=]{2}|[A-Za-z0-9+/]{3}[=]{1})?$");
const base64UrlRegex = weakly(() => new RegExp("^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2}[=]{2}|[A-Za-z0-9_-]{3}[=]{1})?$"));

/**
 * **Standard :** RFC 4648
 * 
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-8
 * 
 * @version 1.0.0
 */
export function isBase16(str: string, options?: undefined): boolean {
	if (typeof str !== "string") {
		throw new Error("The 'str' argument must be of type string.");
	}

	return (str.length % 2 === 0 && base16Regex.test(str));
}

/**
 * **Standard :** RFC 4648
 * 
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-6
 * 
 * @version 1.0.0
 */
export function isBase32(str: string, options?: undefined): boolean {
	if (typeof str !== "string") {
		throw new Error("The 'str' argument must be of type string.");
	}

	return (str.length % 8 === 0 && base32Regex.test(str));
}

/**
 * **Standard :** RFC 4648
 * 
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-7
 * 
 * @version 1.0.0
 */
export function isBase32Hex(str: string, options?: undefined): boolean {
	if (typeof str !== "string") {
		throw new Error("The 'str' argument must be of type string.");
	}

	return (str.length % 8 === 0 && base32HexRegex().test(str));
}

/**
 * **Standard :** RFC 4648
 * 
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-4
 * 
 * @version 1.0.0
 */
export function isBase64(str: string, options?: undefined): boolean {
	if (typeof str !== "string") {
		throw new Error("The 'str' argument must be of type string.");
	}

	return (str.length % 4 == 0 && base64Regex.test(str));
}

/**
 * **Standard :** RFC 4648
 * 
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-5
 * 
 * @version 1.0.0
 */
export function isBase64Url(str: string, options?: undefined): boolean {
	if (typeof str !== "string") {
		throw new Error("The 'str' argument must be of type string.");
	}

	return (str.length % 4 === 0 && base64UrlRegex().test(str));
}