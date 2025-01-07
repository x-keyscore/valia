"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIp = isIp;
const tools_1 = require("../../tools");
/**
 * **Checked character :**
 * * `DIGIT = %x30-39` 0-9.
 * * `HEXDIG = DIGIT / "A" / "B" / "C" / "D" / "E" / "F"`
 */
function isHexadecimal(codePoint) {
    // "A"-"F"
    if (codePoint >= 65 && codePoint <= 70)
        return (true);
    // DIGIT
    if (codePoint >= 48 && codePoint <= 57)
        return (true);
    return (false);
}
/**
 * **No standard**
 *
 * **Checked composition :**
 * * `DIGIT =  %x30-39` 0-9.
 * * `dec-octet = 1*3DIGIT` Representing a decimal integer value in the range 0 through 255.
 * * `dec-octet 3("."  dec-octet)`
 */
function isIpV4Address(utf16UnitArray) {
    let arrayLength = utf16UnitArray.length;
    let dotCount = 0;
    let digCount = 0;
    let decByte = 0;
    let isNull = 0;
    let i = 0;
    if (arrayLength < 7 || arrayLength > 15)
        return (false);
    while (i < arrayLength) {
        digCount = 0;
        decByte = 0;
        isNull = 0;
        while (i < arrayLength) {
            const code = utf16UnitArray[i];
            if (digCount > 3)
                return (false);
            if (code === 46) { // "."
                if (digCount === 0 || decByte > 255)
                    return (false);
                dotCount++;
                break;
            }
            else if (code >= 49 && code <= 57 && !isNull) { // "1"-"9"
                decByte = decByte * 10 + (code - 48);
                digCount++;
            }
            else if (code === 48 && !isNull) { // "0"
                if (!decByte)
                    isNull = 1;
                decByte = decByte * 10;
                digCount++;
            }
            else {
                return (false);
            }
            i++;
        }
        i++;
    }
    if (digCount === 0 || decByte > 255 || dotCount !== 3)
        return (false);
    return (true);
}
/**
 * **No standard**
 *
 * **Checked composition :**
 * `1*2DIGIT` Representing a decimal integer value in the range 0 through 32.
 */
function isIpV4Prefix(utf16UnitArray) {
    let arrayLength = utf16UnitArray.length;
    let decPrefix = 0;
    let digCount = 0;
    let isNull = 0;
    let i = 0;
    if (arrayLength < 1 || arrayLength > 2)
        return (false);
    while (i < arrayLength) {
        const code = utf16UnitArray[i];
        if (digCount > 2)
            return (false);
        if (code >= 49 && code <= 57 && !isNull) { // "1"-"9"
            decPrefix = decPrefix * 10 + (code - 48);
            digCount++;
        }
        else if (code === 48 && !isNull) { // "0"
            if (!decPrefix)
                isNull = 1;
            decPrefix = decPrefix * 10;
            digCount++;
        }
        else {
            return (false);
        }
        i++;
    }
    if (decPrefix > 32)
        return (false);
    return (true);
}
/**
 * **No standard**
 *
 * **Checked composition :**
 * `1*4HEXDIG 7(":" 1*4HEXDIG)`
 */
function isIPv6Full(utf16UnitArray) {
    let i = utf16UnitArray.length - 1;
    let hexCount = 0;
    let colonCount = 0;
    while (i >= 0) {
        const code = utf16UnitArray[i];
        if (code === 58) { // ":"
            if (hexCount < 1 || hexCount > 4)
                return (false);
            hexCount = 0;
            colonCount++;
        }
        else if (isHexadecimal(code)) {
            hexCount++;
        }
        else {
            return (false);
        }
        i--;
    }
    if (hexCount < 1 || hexCount > 4 || colonCount !== 7)
        return (false);
    return (true);
}
/**
 * **No standard**
 *
 * **Checked composition :**
 * `[1*4HEXDIG *5(":" 1*4HEXDIG)] "::" [1*4HEXDIG *5(":" 1*4HEXDIG)]`
 */
function isIPv6Comp(utf16UnitArray) {
    let i = utf16UnitArray.length - 1;
    let hexCount = 0;
    let colonCount = 0;
    let doubleColon = 0;
    while (i >= 0) {
        const code = utf16UnitArray[i];
        if (code === 58) { // ":"
            if (hexCount > 4)
                return (false);
            if (utf16UnitArray[i - 1] === 58) { // ":"
                if (doubleColon || colonCount > 5)
                    return (false);
                colonCount = 0;
                doubleColon++;
                i--;
            }
            else {
                if (hexCount < 1 || colonCount > 5)
                    return (false);
                colonCount++;
            }
            hexCount = 0;
        }
        else if (isHexadecimal(code)) {
            hexCount++;
        }
        else {
            return (false);
        }
        i--;
    }
    if (!doubleColon || (colonCount && (colonCount > 5 || hexCount < 1 || hexCount > 4)))
        return (false);
    return (true);
}
/**
 * **No standard**
 *
 * **Checked composition :**
 * `1*4HEXDIG 5(":" 1*4HEXDIG) ":" IPv4-address-literal`
 */
function isIPv6v4Full(utf16UnitArray) {
    let i = utf16UnitArray.length - 1;
    let hexCount = 0;
    let colonCount = 0;
    while (i >= 0 && utf16UnitArray[i] !== 58) { // ":"
        i--;
    }
    const v4Address = utf16UnitArray.slice(i + 1);
    if (!isIpV4Address(v4Address))
        return (false);
    i--;
    while (i >= 0) {
        const code = utf16UnitArray[i];
        if (code === 58) { // ":"
            if (hexCount < 1 || hexCount > 4)
                return (false);
            hexCount = 0;
            colonCount++;
        }
        else if (isHexadecimal(code)) {
            hexCount++;
        }
        else {
            return (false);
        }
        i--;
    }
    if (hexCount < 1 || hexCount > 4 || colonCount !== 5)
        return (false);
    return (true);
}
/**
 * **No standard**
 *
 * **Checked composition :**
 * `[1*4HEXDIG *3(":" 1*4HEXDIG)] "::" [1*4HEXDIG *3(":" 1*4HEXDIG) ":"] IPv4-address-literal`
 */
function isIPv6v4Comp(utf16UnitArray) {
    let i = utf16UnitArray.length - 1;
    let hexCount = 0;
    let colonCount = 0;
    let doubleColon = 0;
    while (i >= 0 && utf16UnitArray[i] !== 58) { // ":"
        i--;
    }
    const v4Address = utf16UnitArray.slice(i + 1);
    if (!isIpV4Address(v4Address))
        return (false);
    if (utf16UnitArray[i] === 58 && utf16UnitArray[i - 1] !== 58)
        i--;
    while (i >= 0) {
        const code = utf16UnitArray[i];
        if (code === 58) { // ":"
            if (hexCount > 4)
                return (false);
            if (utf16UnitArray[i - 1] === 58) { // ":"
                if (doubleColon || colonCount > 5)
                    return (false);
                colonCount = 0;
                doubleColon++;
                i--;
            }
            else {
                if (hexCount < 1 || colonCount > 5)
                    return (false);
                colonCount++;
            }
            hexCount = 0;
        }
        else if (isHexadecimal(code)) {
            hexCount++;
        }
        else {
            return (false);
        }
        i--;
    }
    if (!doubleColon || (colonCount && (colonCount > 5 || hexCount < 1 || hexCount > 4)))
        return (false);
    return (true);
}
/**
 * **No standard**
 *
 * **Checked composition :**
 * `"IPv6:" (IPv6-full / IPv6-comp / IPv6v4-full / IPv6v4-comp)`
 */
function isIpV6Address(addr) {
    if (isIPv6Full(addr))
        return (true);
    else if (isIPv6Comp(addr))
        return (true);
    else if (isIPv6v4Full(addr))
        return (true);
    else if (isIPv6v4Comp(addr))
        return (true);
    return (false);
}
/**
 * **No standard**
 *
 * **Checked composition :**
 * `1*3DIGIT` Representing a decimal integer value in the range 0 through 128.
 */
function isIpV6Prefix(utf16UnitArray) {
    let arrayLength = utf16UnitArray.length;
    let decPrefix = 0;
    let digCount = 0;
    let isNull = 0;
    let i = 0;
    if (arrayLength < 1 || arrayLength > 3)
        return (false);
    while (i < arrayLength) {
        const code = utf16UnitArray[i];
        if (digCount > 3)
            return (false);
        if (code >= 49 && code <= 57 && !isNull) { // "1"-"9"
            decPrefix = decPrefix * 10 + (code - 48);
            digCount++;
        }
        else if (code === 48 && !isNull) { // "0"
            if (!decPrefix)
                isNull = 1;
            decPrefix = decPrefix * 10;
            digCount++;
        }
        else {
            return (false);
        }
        i++;
    }
    if (decPrefix > 128)
        return (false);
    return (true);
}
/**
 * **Not standardized**
 */
function extractAddrAndPrefix(utf16UnitArray) {
    const arrayLength = utf16UnitArray.length;
    // FIND SLASH INDEX
    let i = 0;
    while (i < arrayLength && utf16UnitArray[i] !== 47) { // "/"
        i++;
    }
    // CHECK SLASH INDEX
    if (i === arrayLength) {
        return ({
            addr: utf16UnitArray,
            prefix: null
        });
    }
    // CHECK PREFIX LENGHT
    if (i === arrayLength - 1)
        return (null);
    const slashIndex = i;
    return {
        addr: utf16UnitArray.slice(0, slashIndex),
        prefix: utf16UnitArray.slice(slashIndex + 1, arrayLength),
    };
}
/**
 * @param input Can be either a `string` or a `Uint16Array` containing the decimal values ​​of the string in code point Unicode format.
 *
 * **Implementation version :** 1.1.0-beta
 *
 * ==============================
 *
 * **IPv4**
 *
 * **Standard:** No standard
 *
 * **Checked composition :**
 * * `DIGIT = %x30-39` 0-9.
 * * `dec-octet = 1*3DIGIT` Representing a decimal integer value in the range 0 through 255.
 * * `prefix = 1*2DIGIT` Representing a decimal integer value in the range 0 through 32.
 * * `IPv4 = dec-octet 3("." dec-octet) ["/" prefix]`
 *
 * **Implementation version :** 1.0.0
 *
 * ==============================
 *
 * **IPv6**
 *
 * **Standard :** No standard
 *
 * **Checked composition :**
 * * `DIGIT = %x30-39` 0-9.
 * * `HEXDIG = DIGIT / "A" / "B" / "C" / "D" / "E" / "F"`
 * * `IPv6-full = 1*4HEXDIG 7(":" 1*4HEXDIG)`
 * * `IPv6-comp = [1*4HEXDIG *5(":" 1*4HEXDIG)] "::" [1*4HEXDIG *5(":" 1*4HEXDIG)]`
 * * `IPv6v4-full = 1*4HEXDIG 5(":" 1*4HEXDIG) ":" IPv4`
 * * `IPv6v4-comp = [1*4HEXDIG *3(":" 1*4HEXDIG)] "::" [1*4HEXDIG *3(":" 1*4HEXDIG) ":"] IPv4`
 * * `prefix = 1*3DIGIT` Representing a decimal integer value in the range 0 through 128.
 * * `IPv6 = (IPv6-full / IPv6-comp / IPv6v4-full / IPv6v4-comp) ["/" prefix]`
 */
function isIp(input, params) {
    const utf16UnitArray = typeof input === "string" ? (0, tools_1.createUTF16UnitArray)(input) : input;
    const parts = extractAddrAndPrefix(utf16UnitArray);
    if (!parts)
        return (false);
    if (((!params?.CIDR || params?.CIDR === "D") && parts.prefix)
        || (params?.CIDR === "R" && !parts.prefix))
        return (false);
    // CHECK IPV4 ADDRESS
    if (params?.allowIpV6 !== false && isIpV4Address(parts.addr)) {
        if (parts.prefix) {
            // CHECK IPV4 PREFIX
            if (!isIpV4Prefix(parts.prefix))
                return (false);
        }
        return (true);
    }
    // CHECK IPV6 ADDRESS
    if (params?.allowIpV6 !== false && isIpV6Address(parts.addr)) {
        if (parts.prefix) {
            // CHECK IPV6 PREFIX
            if (!isIpV6Prefix(parts.prefix))
                return (false);
        }
        return (true);
    }
    return (false);
}
