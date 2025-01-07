/**
 * @param input Can be either a `string` or a `Uint16Array` containing the decimal values ​​of the string in code point Unicode format.
 * @returns `true` if all characters in the string are between 0 and 9 (%d48-%d57) otherwise `false`.
 */
export declare function isDigit(input: string | Uint16Array, params?: never): boolean;
