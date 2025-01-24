import { stringToUTF16UnitArray } from "../../tools";

/**
 * @returns Check if all characters of the string are in the ascii table (%d0-%d127).
 * Empty returns false.
 */
export function isAscii(str: string, params?: undefined): boolean {
    return (RegExp("^[\\x00-\\x7F]+$").test(str));
}