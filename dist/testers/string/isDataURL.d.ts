import { LooseAutocomplete } from "../../types";
interface IsDataUrlParams {
    /**
     * Specifies the type of media, corresponding to the **image** type in the example.
     *
     * **Exemple:** data:**image**\/gif;base64,R0lGODdhMA
     */
    type?: LooseAutocomplete<"text" | "image" | "audio" | "video" | "application" | "message" | "multipart">;
    /**
     * Specifies the sub-type of media, corresponding to the **gif** sub-type in the example.
     *
     * **Exemple:** data:image/**gif**;base64,R0lGODdhMA
     */
    subtype?: string[];
}
/**
 * **Standard :** RFC 2397
 *
 *  @see https://datatracker.ietf.org/doc/html/rfc2397#section-3
 *
 * **Follows :**
 * `dataurl`
 *
 * @version 1.0.0-beta
 */
export declare function isDataURL(str: string, params?: IsDataUrlParams): boolean;
export {};
