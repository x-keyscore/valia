"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDigit = isDigit;
/**
 * @returns Check if all characters of the string are between 0 and 9 (%d48-%d57).
 * Empty returns false.
 */
function isDigit(str, params) {
    return (RegExp("^[0-9]+$").test(str));
}
