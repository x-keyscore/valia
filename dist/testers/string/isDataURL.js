"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDataURL = isDataURL;
const tools_1 = require("../../tools");
/**
 * @param input Can be either a `string` or a `Uint16Array` containing the decimal values ​​of the string in code point Unicode format.
 *
 * **Implementation version :** 1.0.0-beta
 *
 * ==============================
 *
 * **Standard :** RFC 2397
 *
 *  @see https://datatracker.ietf.org/doc/html/rfc2397#section-3
 *
 * **Follows :**
 * `dataurl`
 */
function isDataURL(input, params) {
    const utf16UnitArray = typeof input === "string" ? (0, tools_1.createUTF16UnitArray)(input) : input;
    return (true);
}
