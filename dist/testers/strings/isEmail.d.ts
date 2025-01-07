interface IsEmailParams {
    /**
     * **Warning:** Enabling this parameter allows xss attacks
     *
     * **Default:** `false`
     */
    allowQuotedString?: boolean;
    /**
     * **Warning:** Enabling this parameter allows XSS attacks
     *
     * **Default:** `false`
     */
    allowAddressLiteral?: boolean;
}
/**
 * @param input Can be either a `string` or a `Uint16Array` containing the decimal values ​​of the string in code point Unicode format.
 *
 * **Implementation version :** 1.1.0-beta
 *
 * ==============================
 *
 * **Standard :** RFC 5321
 *
 *  @see https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.2
 *
 * **Follows :**
 * `Mailbox`
 */
export declare function isEmail(input: string | Uint16Array, params?: IsEmailParams): boolean;
export {};
