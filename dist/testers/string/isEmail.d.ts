interface IsEmailParams {
    /** **Default:** `false` */
    allowQuotedString?: boolean;
    /** **Default:** `false` */
    allowAddressLiteral?: boolean;
    /** **Default:** `false` */
    allowGeneralAddressLiteral?: boolean;
}
/**
 * **Standard :** RFC 5321
 *
 *  @see https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.2
 *
 * **Follows :**
 * `Mailbox`
 *
 * @version 1.1.0-beta
 */
export declare function isEmail(str: string, params?: IsEmailParams): boolean;
export {};
