"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDataUrl = isDataUrl;
const utils_1 = require("../utils");
/** @see https://datatracker.ietf.org/doc/html/rfc6838#section-4.2 */
const ianaTokenPattern = "(?:[a-zA-Z0-9](?:[+]?[a-zA-Z0-9!#$&^_-][.]?){0,126})";
const discreteTypePattern = "(?:text|image|application|audio|video|message|multipart)";
const parameterPattern = "[-!*+.0-9A-Z\\x23-\\x27\\x5E-\\x7E]+=(?:[-!*+.0-9A-Z\\x23-\\x27\\x5E-\\x7E]+|\"(?:[^\\\"\\x13]|\\\\[\\x00-\\x7F])+\")";
const mediatypePattern = `${discreteTypePattern}\\/${ianaTokenPattern}(?:;${parameterPattern})*`;
const contentPattern = "(?:[a-zA-Z0-9-;/?:@&=+$,_.!~*'()]|%[a-zA-Z0-9]{2})*";
const dataUrlRegex = (0, utils_1.lazy)(() => new RegExp(`^data:(?:${mediatypePattern})?(?:;base64)?,${contentPattern}$`));
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
function isDataUrl(str, params) {
    if (!dataUrlRegex().test(str))
        return (false);
    if ((params === null || params === void 0 ? void 0 : params.type) || (params === null || params === void 0 ? void 0 : params.subtype)) {
        const [_, type, subtype] = new RegExp("^data:(.*?)\/(.*?)[;|,]").exec(str);
        if ((params === null || params === void 0 ? void 0 : params.type) && params.type !== type)
            return (false);
        if ((params === null || params === void 0 ? void 0 : params.subtype) && !(params === null || params === void 0 ? void 0 : params.subtype.includes(subtype)))
            return (false);
    }
    return (true);
}
