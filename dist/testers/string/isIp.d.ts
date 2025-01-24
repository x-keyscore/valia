/**
 * IPV4
 *
 * Composition :
 * * "DIGIT = %x30-39" 0-9.
 * * "dec-octet = 1*3DIGIT" Representing a decimal integer value in the range 0 through 255.
 * * "prefix = 1*2DIGIT" Representing a decimal integer value in the range 0 through 32.
 * * "IPv4 = dec-octet 3("." dec-octet) ["/" prefix]"
 *
 * IPV6
 *
 * Composition :
 * * "DIGIT = %x30-39" 0-9.
 * * "HEXDIG = DIGIT / A-F / a-f"
 * * "IPv6-full = 1*4HEXDIG 7(":" 1*4HEXDIG)"
 * * "IPv6-comp = [1*4HEXDIG *5(":" 1*4HEXDIG)] "::" [1*4HEXDIG *5(":" 1*4HEXDIG)]"
 * * "IPv6v4-full = 1*4HEXDIG 5(":" 1*4HEXDIG) ":" IPv4"
 * * "IPv6v4-comp = [1*4HEXDIG *3(":" 1*4HEXDIG)] "::" [1*4HEXDIG *3(":" 1*4HEXDIG) ":"] IPv4"
 * * "prefix = 1*3DIGIT" Representing a decimal integer value in the range 0 through 128.
 * * "IPv6 = (IPv6-full / IPv6-comp / IPv6v4-full / IPv6v4-comp) ["/" prefix]"
 */
interface IsIpParams {
    /**
     * Indicates whether the input is in CIDR* notation (e.g., `192.168.0.1/22`).
     *
     * **Default:** `false`
     *
     * *Classless Inter-Domain Routing
     */
    prefix?: boolean;
}
export declare const ipV4Pattern = "(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])";
export declare const IPv6Pattern: string;
/**
 * **Standard:** No standard
 *
 * @version 1.0.0
 */
export declare function isIp(str: string, params?: IsIpParams): boolean;
/**
 * **Standard:** No standard
 *
 * @version 1.0.0
 */
export declare function isIpV4(str: string, params?: IsIpParams): boolean;
/**
 * **Standard:** No standard
 *
 * @version 1.0.0
 */
export declare function isIpV6(str: string, params?: IsIpParams): boolean;
export {};
