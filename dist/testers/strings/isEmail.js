"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmail = isEmail;
const tools_1 = require("../../tools");
const isIp_1 = require("./isIp");
/**
 * @see https://datatracker.ietf.org/doc/html/rfc5234#appendix-B.1
 *
 * * **Follows :**
 * `ALPHA` and `DIGIT`
 */
function isAlphanumeric(codePoint) {
    // ALPHA
    if ((codePoint | 32) >= 97 && (codePoint | 32) <= 122)
        return (true);
    // DIGIT
    if (codePoint >= 48 && codePoint <= 57)
        return (true);
    return (false);
}
/**
 * @see https://datatracker.ietf.org/doc/html/rfc5322#section-3.2.3
 *
 * **Follows :**
 * `atext`
 */
function isAtextChar(codePoint) {
    // ALPHA
    if ((codePoint | 32) >= 97 && (codePoint | 32) <= 122)
        return (true);
    // DIGIT
    if (codePoint >= 48 && codePoint <= 57)
        return (true);
    switch (codePoint) {
        case 33: // !
        case 35: // #
        case 36: // $
        case 37: // %
        case 38: // &
        case 39: // '
        case 42: // *
        case 43: // +
        case 45: // -
        case 47: // /
        case 61: // =
        case 63: // ?
        case 94: // ^
        case 95: // _
        case 96: // `
        case 123: // {
        case 124: // |
        case 125: // }
        case 126: // ~
            return true;
    }
    return (false);
}
/**
 * @see https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.2
 *
 * **Follows :**
 * `qtextSMTP`
 */
function isQtextSMTPChar(codePoint) {
    // %d32-33
    if (codePoint >= 32 && codePoint <= 33)
        return (true);
    // %%d35-91
    if (codePoint >= 35 && codePoint <= 91)
        return (true);
    // %d93-126
    if (codePoint >= 93 && codePoint <= 126)
        return (true);
    return (false);
}
/**
 * @see https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.2
 *
 * **Follows :**
 * Second part of `quoted-pairSMTP`
 */
function isQpairSMTPChar(codePoint) {
    // %d32-126
    if (codePoint >= 32 && codePoint <= 126)
        return (true);
    return (false);
}
/**
 * @see https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.3
 *
 * **Follows :**
 * ` dcontent`
 */
function isDcontentChar(codePoint) {
    // %d33-90
    if (codePoint >= 33 && codePoint <= 90)
        return (true);
    // %d94-126
    if (codePoint >= 94 && codePoint <= 126)
        return (true);
    return (false);
}
/**
 * @see https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.2
 *
 * **Follows :**
 * `Quoted-string`
 *
 * **Skipped composition :**
 * `DQUOTE *(qtextSMTP / quoted-pairSMTP) DQUOTE`
 */
function skipQuotedString(utf16UnitArray, startIndex) {
    const arrayLength = utf16UnitArray.length;
    let i = startIndex;
    // CHECK START QUOTE
    if (utf16UnitArray[i] !== 92)
        return (i); // "\""
    i++;
    while (i < arrayLength) {
        const code = utf16UnitArray[i];
        if (code === 34) { // "\""
            return (++i);
        }
        else if (code === 92) { // "\"
            if (++i > arrayLength || !isQpairSMTPChar(utf16UnitArray[i]))
                return (-1);
        }
        else if (!isQtextSMTPChar(code)) {
            return (-1);
        }
        i++;
    }
    return (-1);
}
/**
 * @see https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.2
 *
 * **Follows :**
 * `Dot-string`
 *
 * **Skipped composition :**
 * `1*atext *("."  1*atext)`
 */
function skipDotString(utf16UnitArray, startIndex) {
    const arrayLength = utf16UnitArray.length;
    let i = startIndex;
    let startAtom = 1;
    while (i < arrayLength) {
        const code = utf16UnitArray[i];
        if (code === 46) { // "."
            if (startAtom)
                return (-1);
            startAtom = 1;
        }
        else if (isAtextChar(code)) {
            if (startAtom)
                startAtom = 0;
        }
        else {
            break;
        }
        i++;
    }
    if (startAtom)
        return (-1);
    return (i);
}
/**
 * @see https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.2
 *
 * **Follows :**
 * `Local-part`
 *
 * **Validated composition :**
 * `Dot-string / Quoted-string`
 */
function isValidLocalPart(utf16UnitArray, allowQuotedString) {
    let i = 0;
    /** @see https://datatracker.ietf.org/doc/html/rfc5321#section-4.5.3.1.1 */
    if ((0, tools_1.getUTF8ByteLengthFromUTF16UnitArray)(utf16UnitArray) > 64)
        return (false);
    if (allowQuotedString && utf16UnitArray[i] === 92) { // "\""
        i = skipQuotedString(utf16UnitArray, i);
        if (i === -1)
            return (false);
    }
    else {
        i = skipDotString(utf16UnitArray, i);
        if (i === -1)
            return (false);
    }
    if (i !== utf16UnitArray.length)
        return (false);
    return (true);
}
/**
 * @see https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.3
 *
 * **Follows :**
 * `General-address-literal`
 *
 * **Checked composition :**
 * `*( ALPHA / DIGIT / "-" ) ALPHA / DIGIT ":" 1*dcontent`
 */
function isGeneralAddressLiteral(utf16UnitArray) {
    let i = utf16UnitArray.length - 1;
    let colonIndex = 0;
    while (i >= 0) {
        const code = utf16UnitArray[i];
        if (code === 58) { // ":"
            break;
        }
        else if (!isDcontentChar(code)) {
            return (false);
        }
        i--;
    }
    if (i < 1 || i === utf16UnitArray.length - 1)
        return (false);
    colonIndex = i--;
    while (i >= 0) {
        const code = utf16UnitArray[i];
        if (code === 45) { // "-"
            if (colonIndex - 1 === i)
                return (false);
        }
        else if (!isAlphanumeric(code)) {
            return (false);
        }
        i--;
    }
    return (true);
}
/**
 * @see https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.2
 *
 * **Follows :**
 * `address-literal`
 *
 * **Checked composition :**
 * `"[" (IPv4-address-literal / IPv6-address-literal / General-address-literal) "]"`
 */
function isAddressLiteral(utf16UnitArray) {
    const arrayLength = utf16UnitArray.length;
    // CHECK START BRACKET
    if (utf16UnitArray[0] !== 91)
        return (false); // "["
    // CHECK END BRACKET
    if (utf16UnitArray[arrayLength - 1] !== 93)
        return (-1); // "]"
    const address = utf16UnitArray.slice(1, arrayLength - 2);
    if ((0, isIp_1.isIp)(address))
        return (true);
    else if (isGeneralAddressLiteral(address))
        return (true);
    return (false);
}
/**
 * @see https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.2
 *
 * **Follows :**
 * `Domain`
 *
 * **Skipped composition :**
 * * `sub-domain = ALPHA / DIGIT [*( ALPHA / DIGIT / "-" ) ALPHA / DIGIT]`
 * * `domain = sub-domain *("." sub-domain)`
 */
function isDomain(utf16UnitArray) {
    const arrayLength = utf16UnitArray.length;
    let prevIsDot = 1;
    let prevIsHyp = 0;
    let i = 0;
    while (i < arrayLength) {
        const code = utf16UnitArray[i];
        if (code === 46) { // "."
            if (prevIsDot || prevIsHyp)
                return (false);
            prevIsDot = 1;
        }
        else if (code === 45) { // "-"
            if (prevIsDot)
                return (false);
            prevIsHyp = 1;
        }
        else if (isAlphanumeric(code)) {
            prevIsDot = 0;
            prevIsHyp = 0;
        }
        else {
            return (false);
        }
        i++;
    }
    if (prevIsDot || prevIsHyp)
        return (false);
    return (i);
}
/**
 * @see https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.2
 *
 * **Follows :**
 * Third part of `Mailbox`
 *
 * **Checked composition :**
 * `Domain / address-literal`
 */
function isValidDomainPart(utf16UnitArray, allowAddressLiteral) {
    if (allowAddressLiteral && isAddressLiteral(utf16UnitArray)) {
        return (true);
    }
    else if (isDomain(utf16UnitArray)) {
        /** @see https://datatracker.ietf.org/doc/html/rfc5321#section-4.5.3.1.2 */
        if ((0, tools_1.getUTF8ByteLengthFromUTF16UnitArray)(utf16UnitArray) <= 255)
            return (true);
    }
    return (false);
}
/**
 * @see https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.2
 *
 * **Follows :**
 * `Mailbox`
 */
function extractLocalAndDomain(utf16UnitArray) {
    const arrayLength = utf16UnitArray.length;
    // FIND SYMBOL INDEX
    let i = 0;
    while (i < arrayLength && utf16UnitArray[i] !== 64) { // "@"
        i++;
    }
    // CHECK SYMBOL CHAR
    if (utf16UnitArray[i] !== 64)
        return (null); // "@"
    const symbolIndex = i;
    // CHECK LOCAL LENGTH
    if (!symbolIndex)
        return (null);
    // CHECK DOMAIN LENGTH
    const domainLength = arrayLength - (symbolIndex + 1);
    if (!domainLength)
        return (null);
    return {
        local: utf16UnitArray.slice(0, symbolIndex),
        domain: utf16UnitArray.slice(symbolIndex + 1, arrayLength),
    };
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
function isEmail(input, params) {
    const utf16UnitArray = typeof input === "string" ? (0, tools_1.createUTF16UnitArray)(input) : input;
    const parts = extractLocalAndDomain(utf16UnitArray);
    if (parts === null)
        return (false);
    if (!isValidLocalPart(parts.local, params?.allowQuotedString || false))
        return (false);
    if (!isValidDomainPart(parts.domain, params?.allowAddressLiteral || false))
        return (false);
    return (true);
}
