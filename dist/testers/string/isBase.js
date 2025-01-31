"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBase64 = isBase64;
exports.isBase64Url = isBase64Url;
exports.isBase32 = isBase32;
exports.isBase32Hex = isBase32Hex;
exports.isBase16 = isBase16;
const utils_1 = require("../../utils");
const utils_2 = require("../utils");
const base16Regex = new RegExp("^(?:[A-F0-9]{2})*$");
const base32Regex = new RegExp("^(?:[A-Z2-7]{8})*(?:[A-Z2-7]{2}[=]{6}|[A-Z2-7]{4}[=]{4}|[A-Z2-7]{5}[=]{3}|[A-Z2-7]{6}[=]{2}|[A-Z2-7]{7}[=]{1})?$");
const base32HexRegex = (0, utils_2.lazy)(() => new RegExp("^(?:[0-9A-V]{8})+(?:[0-9A-V]{2}[=]{6}|[0-9A-V]{4}[=]{4}|[0-9A-V]{5}[=]{3}|[0-9A-V]{6}[=]{2}|[0-9A-V]{7}[=]{1})?$"));
const base64Regex = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}[=]{2}|[A-Za-z0-9+/]{3}[=]{1})?$");
const base64UrlRegex = (0, utils_2.lazy)(() => new RegExp("^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2}[=]{2}|[A-Za-z0-9_-]{3}[=]{1})?$"));
/**
 * **Standard :** RFC 4648
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-4
 *
 * @version 1.0.0
 */
function isBase64(str, params) {
    if (typeof str !== "string")
        new utils_1.Err("Parameters", "'str' must be of type string.");
    return (str.length % 4 == 0 && base64Regex.test(str));
}
/**
 * **Standard :** RFC 4648
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-5
 *
 * @version 1.0.0
 */
function isBase64Url(str, params) {
    if (typeof str !== "string")
        new utils_1.Err("Parameters", "'str' must be of type string.");
    return (str.length % 6 === 0 && base64UrlRegex().test(str));
}
/**
 * **Standard :** RFC 4648
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-6
 *
 * @version 1.0.0
 */
function isBase32(str, params) {
    if (typeof str !== "string")
        new utils_1.Err("Parameters", "'str' must be of type string.");
    return (str.length % 8 === 0 && base32Regex.test(str));
}
/**
 * **Standard :** RFC 4648
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-7
 *
 * @version 1.0.0
 */
function isBase32Hex(str, params) {
    if (typeof str !== "string")
        new utils_1.Err("Parameters", "'str' must be of type string.");
    return (str.length % 8 === 0 && base32HexRegex().test(str));
}
/**
 * **Standard :** RFC 4648
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-8
 *
 * @version 1.0.0
 */
function isBase16(str, params) {
    if (typeof str !== "string")
        new utils_1.Err("Parameters", "'str' must be of type string.");
    return (base16Regex.test(str));
}
