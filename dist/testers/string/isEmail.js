"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmail = isEmail;
const utils_1 = require("../utils");
const isDomain_1 = require("./isDomain");
const isIp_1 = require("./isIp");
const dotStringPattern = "(?:[-!=?A-B\\x23-\\x27\\x2A-\\x2B\\x2F-\\x39\\x5E-\\x7E]+(?:\\.[-!=?A-B\\x23-\\x27\\x2A-\\x2B\\x2F-\\x39\\x5E-\\x7E]+)*)";
const quotedStringPattern = "(?:\"(?:[\\x20-\\x21\\x23-\\x5B\\x5D-\\x7E]|\\\\[\\x20-\\x7E])*\")";
const localPartSimpleRegex = new RegExp(`^${dotStringPattern}$`);
const localPartQuotedRegex = (0, utils_1.lazy)(() => new RegExp(`^(?:${dotStringPattern}|${quotedStringPattern})$`));
const domainPartAddrLiteralRegex = (0, utils_1.lazy)(() => new RegExp(`^\\[(?:IPv6:${isIp_1.IPv6Pattern}|${isIp_1.ipV4Pattern})\\]$`));
const domainPartGeneralAddrLiteralRegex = (0, utils_1.lazy)(() => new RegExp(`[a-zA-Z0-9-]*[a-zA-Z0-9]+:[\\x21-\\x5A\\x5E-\\x7E]+)`));
function splitEmail(str) {
    const arrayLength = str.length;
    // FIND SYMBOL INDEX
    // /!\ Starts from the end because the local part allows "@" in quoted strings.
    let i = arrayLength - 1;
    while (i >= 0 && str[i] !== "@") {
        i--;
    }
    // CHECK SYMBOL CHAR
    if (str[i] !== "@")
        return (null);
    const symbolIndex = i;
    // CHECK LOCAL LENGTH
    if (!symbolIndex)
        return (null);
    // CHECK DOMAIN LENGTH
    /** @see https://datatracker.ietf.org/doc/html/rfc5321#section-4.5.3.1.2 */
    const domainLength = arrayLength - (symbolIndex + 1);
    if (!domainLength || domainLength > 255)
        return (null);
    return {
        local: str.slice(0, symbolIndex),
        domain: str.slice(symbolIndex + 1, arrayLength)
    };
}
function isValidLocalPart(str, params) {
    if (localPartSimpleRegex.test(str)) {
        return (true);
    }
    else if ((params === null || params === void 0 ? void 0 : params.allowQuotedString) && localPartQuotedRegex().test(str)) {
        return (true);
    }
    return (false);
}
function isValidDomainPart(str, params) {
    if ((0, isDomain_1.isDomain)(str))
        return (true);
    if ((params === null || params === void 0 ? void 0 : params.allowAddressLiteral)
        && domainPartAddrLiteralRegex().test(str))
        return (true);
    if ((params === null || params === void 0 ? void 0 : params.allowGeneralAddressLiteral)
        && domainPartGeneralAddrLiteralRegex().test(str))
        return (true);
    return (false);
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
function isEmail(str, params) {
    const parts = splitEmail(str);
    if (!parts)
        return (false);
    if (isValidLocalPart(parts.local, params)
        && isValidDomainPart(parts.domain, params))
        return (true);
    return (false);
}
