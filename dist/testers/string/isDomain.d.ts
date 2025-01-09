/**
 *  @param input Can be either a `string` or a `Uint16Array` containing the decimal values ​​of the string in code point Unicode format.
 *
 * **Implementation version :** 1.0.0-beta
 *
 * ==============================
 *
 * **Standard :** RFC 1035
 *
 * @see https://datatracker.ietf.org/doc/html/rfc1035#section-2.3.1
 *
 * **Follows :**
 * `<domain>`
 *
 * **Checked composition :**
 * * `letter = %d65-%d90 / %d97-%d122` A-Z / a-z
 * * `digit = %x30-39` 0-9
 * * `label = letter [*(digit / letter / "-") digit / letter]`
 * * `domain = label *("." label)`
 */
export declare function isDomain(input: string | Uint16Array, params?: undefined): boolean;
