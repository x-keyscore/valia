"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAlpha = isAlpha;
/**
 * @returns Check if all characters of the string are between A and Z or a and z (%d65-%d90 / %d97-%d122).
 * Empty returns false.
 */
function isAlpha(str, params) {
    return (RegExp("^[a-zA-Z]+$").test(str));
}
