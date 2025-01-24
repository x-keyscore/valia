"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAscii = isAscii;
/**
 * @returns Check if all characters of the string are in the ascii table (%d0-%d127).
 * Empty returns false.
 */
function isAscii(str, params) {
    return (RegExp("^[\\x00-\\x7F]+$").test(str));
}
