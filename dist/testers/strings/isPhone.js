"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPhone = isPhone;
const tools_1 = require("../../tools");
/**
 * @param input Can be either a `string` or a `Uint16Array` containing the decimal values ​​of the string in code point Unicode format.
 *
 * **Implementation version :** 1.0.0-beta
 *
 * ==============================
 *
 * **Standard :** ITU-T E.164
 *
 *  @see https://www.itu.int/rec/t-rec-e.164/fr
 */
function isPhone(input, params) {
    const utf16UnitArray = typeof input === "string" ? (0, tools_1.createUTF16UnitArray)(input) : input;
}
