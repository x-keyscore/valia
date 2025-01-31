interface IsUuidParams {
    /** **Default:** All version validate */
    version?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
}
/**
 * **Standard :** RFC 9562
 *
 * @see https://datatracker.ietf.org/doc/html/rfc9562#section-4
 *
 * @version 1.0.0
 */
export declare function isUuid(str: string, params?: IsUuidParams): boolean;
export {};
