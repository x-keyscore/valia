/**
 * @param input Can be either a `string` or a `Uint16Array` containing
 * the decimal values ​​of the string in code point Unicode format.
 * @returns `true` if all characters in the string are between
 * A and Z or a and z (%d65-%d90 / %d97-%d122) otherwise `false`.
 */
export declare function isAlpha(input: string | Uint16Array, params?: undefined): boolean;
