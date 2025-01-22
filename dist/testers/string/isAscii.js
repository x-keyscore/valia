"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAscii = isAscii;
const tools_1 = require("../../tools");
/**
 * @param input Can be either a `string` or a `Uint16Array`
 * containing the decimal values ​​of the string.
 *
 * @returns Check if all characters of the string are in the ascii table (%d0-%d127).
 */
function isAscii(input, params) {
    const utf16UnitArray = typeof input === "string" ? (0, tools_1.stringToUTF16UnitArray)(input) : input;
    let i = utf16UnitArray.length - 1;
    while (i > -1 && (utf16UnitArray[i] & 0x80) === 0) {
        i--;
    }
    return (i === -1);
}
