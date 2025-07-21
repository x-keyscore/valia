class Issue extends Error {
    constructor(context, message, stack, plugin) {
        super(message);
        const red = "\x1b[31m", cyan = "\x1b[36m", gray = "\x1b[90m", reset = "\x1b[0m";
        const emitter = "Valia" + (plugin ? ":" + plugin : "");
        const timestamp = new Date().toISOString();
        this.message =
            `\n${red}[Error]${reset} ${cyan}[${emitter}]${reset} ${gray}${timestamp}${reset}` +
                `\nContext: ${context}` +
                `\nMessage: ${message}`;
    }
    toString() {
        return `[Error] [Valia] ${new Date().toISOString()}\nContext: test`;
    }
}

class FormatsManager {
    constructor() {
        this.store = new Map();
    }
    add(formats) {
        for (const format of formats) {
            this.store.set(format.type, format);
        }
    }
    has(type) {
        return (!!this.store.has(type));
    }
    get(type) {
        const format = this.store.get(type);
        if (!format)
            throw new Issue("FORMATS MANAGER", "This type is not recognized: " + type);
        return (format);
    }
}

class EventsManager {
    constructor() {
        this.listeners = new Map();
    }
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }
    emit(event, ...args) {
        const callbacks = this.listeners.get(event);
        if (!callbacks)
            return;
        for (const callback of callbacks) {
            callback(...args);
        }
    }
    off(event, callback) {
        const listeners = this.listeners.get(event);
        if (!listeners)
            return;
        const index = listeners.indexOf(callback);
        if (index !== -1)
            listeners.splice(index, 1);
    }
}

class SchemaNodeException extends Error {
    constructor(report) {
        super();
        this.code = report.code;
        this.message = report.message;
        this.node = report.node;
        this.nodePath = report.nodePath;
    }
}
class SchemaDataRejection {
    constructor(report) {
        this.code = report.code;
        this.node = report.node;
        this.nodePath = report.nodePath;
    }
}

function getInternalTag(target) {
    return (Object.prototype.toString.call(target).slice(8, -1));
}

var objectHelpers = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getInternalTag: getInternalTag
});

function convertBase16ToBase64(input, base64, padding) {
    const totalChunksLength = Math.floor(input.length / 6) * 6;
    let output = "";
    let i = 0;
    while (i < totalChunksLength) {
        const dec = parseInt(input.slice(i, i + 6), 16);
        output += (base64[((dec >> 18) & 63)]
            + base64[((dec >> 12) & 63)]
            + base64[((dec >> 6) & 63)]
            + base64[(dec & 63)]);
        i += 6;
    }
    if (i < input.length) {
        const restChunk = input.slice(i, i + 6);
        // 143016576 = 00100 01000 01100 10000 10100 00000 = 4 8 12 16 20 0
        const leftShift = (143016576 >> (restChunk.length * 5)) & 31;
        const dec = parseInt(restChunk, 16) << leftShift;
        output += base64[((dec >> 18) & 63)]
            + base64[((dec >> 12) & 63)];
        if (leftShift < 12)
            output += base64[((dec >> 6) & 63)];
        if (leftShift < 8)
            output += base64[(dec & 63)];
    }
    while (padding && output.length % 4 !== 0) {
        output += '=';
    }
    return (output);
}
function convertBase16ToBase32(input, base32, padding = true) {
    const totalChunksLength = Math.floor(input.length / 10) * 10;
    let output = "";
    let i = 0;
    while (i < totalChunksLength) {
        const decHigh = parseInt(input.slice(i, i + 5), 16);
        const decLow = parseInt(input.slice(i + 5, i + 10), 16);
        output += base32[((decHigh >> 15) & 31)]
            + base32[((decHigh >> 10) & 31)]
            + base32[((decHigh >> 5) & 31)]
            + base32[(decHigh & 31)]
            + base32[((decLow >> 15) & 31)]
            + base32[((decLow >> 10) & 31)]
            + base32[((decLow >> 5) & 31)]
            + base32[(decLow & 31)];
        i += 10;
    }
    if (i < input.length) {
        const restChunk = input.slice(i, i + 5);
        // 4469248 = 00100 01000 01100 10000 00000 = 4 8 12 16 0
        const leftShift = (4469248 >> (restChunk.length * 5)) & 31;
        const decHigh = parseInt(restChunk, 16) << leftShift;
        output += base32[((decHigh >> 15) & 31)]
            + base32[((decHigh >> 10) & 31)];
        if (leftShift < 12) {
            output += base32[((decHigh >> 5) & 31)]
                + base32[(decHigh & 31)];
        }
    }
    if (i + 5 < input.length) {
        const restChunk = input.slice(i + 5, i + 10);
        // 4469248 = 00100 01000 01100 10000 00000 = 4 8 12 16 0
        const leftShift = (4469248 >> (restChunk.length * 5)) & 31;
        const decLow = parseInt(restChunk, 16) << leftShift;
        output += base32[((decLow >> 15) & 31)]
            + base32[((decLow >> 10) & 31)];
        if (leftShift < 12)
            output += base32[((decLow >> 5) & 31)];
        if (leftShift < 8)
            output += base32[(decLow & 31)];
    }
    while (padding && output.length % 8 !== 0) {
        output += '=';
    }
    return (output);
}
function convertBase64ToBase16(input, base64) {
    if (input.endsWith("="))
        input = input.slice(0, input.indexOf("="));
    const totalChunksLength = Math.floor(input.length / 4) * 4;
    const base16 = "0123456789ABCDEF";
    let output = "";
    let i = 0;
    while (i < totalChunksLength) {
        const dec = (base64.indexOf(input[i]) << 18)
            | (base64.indexOf(input[i + 1]) << 12)
            | (base64.indexOf(input[i + 2]) << 6)
            | base64.indexOf(input[i + 3]);
        output += base16[((dec >> 20) & 15)]
            + base16[((dec >> 16) & 15)]
            + base16[((dec >> 12) & 15)]
            + base16[((dec >> 8) & 15)]
            + base16[((dec >> 4) & 15)]
            + base16[(dec & 15)];
        i += 4;
    }
    if (i < input.length) {
        const rest = input.slice(i);
        const restLength = rest.length;
        const dec = ((base64.indexOf(rest[0]) << 18)
            | (rest[1] ? base64.indexOf(rest[1]) << 12 : 0)
            | (rest[2] ? base64.indexOf(rest[2]) << 6 : 0)
            | (rest[3] ? base64.indexOf(rest[3]) : 0));
        output += base16[((dec >> 20) & 15)]
            + base16[((dec >> 16) & 15)];
        if (restLength > 2) {
            output += base16[((dec >> 12) & 15)]
                + base16[((dec >> 8) & 15)];
        }
        if (restLength > 3) {
            output += base16[((dec >> 4) & 15)]
                + base16[(dec & 15)];
        }
    }
    return (output);
}
function convertBase32ToBase16(input, base32) {
    if (input.endsWith("="))
        input = input.slice(0, input.indexOf("="));
    const totalChunksLength = Math.floor(input.length / 8) * 8;
    const base16 = "0123456789ABCDEF";
    let output = "";
    let i = 0;
    while (i < totalChunksLength) {
        const dec = (base32.indexOf(input[i]) << 15)
            | (base32.indexOf(input[i + 1]) << 10)
            | (base32.indexOf(input[i + 2]) << 5)
            | base32.indexOf(input[i + 3]);
        output += base16[((dec >> 16) & 15)]
            + base16[((dec >> 12) & 15)]
            + base16[((dec >> 8) & 15)]
            + base16[((dec >> 4) & 15)]
            + base16[(dec & 15)];
        i += 4;
    }
    if (i < input.length) {
        const rest = input.slice(i);
        const restLength = rest.length;
        const dec = ((base32.indexOf(rest[0]) << 15)
            | (rest[1] ? base32.indexOf(rest[1]) << 10 : 0)
            | (rest[2] ? base32.indexOf(rest[2]) << 5 : 0)
            | (rest[3] ? base32.indexOf(rest[3]) : 0));
        output += base16[((dec >> 16) & 15)]
            + base16[((dec >> 12) & 15)];
        if (restLength > 1) {
            output += base16[((dec >> 8) & 15)]
                + base16[((dec >> 4) & 15)];
        }
        if (restLength > 3) {
            output += base16[(dec & 15)];
            if (i + 5 >= input.length) {
                output += base16[0];
            }
        }
    }
    if (i + 5 < input.length) {
        const rest = input.slice(i + 5);
        const restLength = rest.length;
        const dec = ((base32.indexOf(rest[0]) << 15)
            | (rest[1] ? base32.indexOf(rest[1]) << 10 : 0)
            | (rest[2] ? base32.indexOf(rest[2]) << 5 : 0)
            | (rest[3] ? base32.indexOf(rest[3]) : 0));
        output += base16[((dec >> 16) & 15)]
            + base16[((dec >> 12) & 15)]
            + base16[((dec >> 8) & 15)];
        if (restLength > 2) {
            output += base16[((dec >> 4) & 15)]
                + base16[(dec & 15)];
        }
    }
    return (output);
}
function base16ToBase64(input, to = "B64", padding = true) {
    if (to === "B64") {
        const base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        return (convertBase16ToBase64(input, base64, padding));
    }
    else if (to === "B64URL") {
        const base64Url = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
        return (convertBase16ToBase64(input, base64Url, padding));
    }
    else {
        throw new Issue("Parameters", "The base64 type of the parameter 'to' is unknown.");
    }
}
function base16ToBase32(input, to = "B16", padding = true) {
    if (to === "B16") {
        const base32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        return (convertBase16ToBase32(input, base32, padding));
    }
    else if (to === "B16HEX") {
        const base32Hex = "0123456789ABCDEFGHIJKLMNOPQRSTUV";
        return (convertBase16ToBase32(input, base32Hex, padding));
    }
    else {
        throw new Issue("Parameters", "The base32 type of the parameter 'to' is unknown.");
    }
}
function base64ToBase16(input, from = "B64") {
    if (from === "B64") {
        const base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        return (convertBase64ToBase16(input, base64));
    }
    else if (from === "B64URL") {
        const base64Url = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
        return (convertBase64ToBase16(input, base64Url));
    }
    else {
        throw new Issue("Parameters", "The base64 type of the parameter 'from' is unknown.");
    }
}
function base32ToBase16(input, from = "B16") {
    if (from === "B16") {
        const base32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        return (convertBase32ToBase16(input, base32));
    }
    else if (from === "B16HEX") {
        const base32Hex = "0123456789ABCDEFGHIJKLMNOPQRSTUV";
        return (convertBase32ToBase16(input, base32Hex));
    }
    else {
        throw new Issue("Parameters", "The base32 type of the parameter 'from' is unknown.");
    }
}

var stringHelpers = /*#__PURE__*/Object.freeze({
    __proto__: null,
    base16ToBase32: base16ToBase32,
    base16ToBase64: base16ToBase64,
    base32ToBase16: base32ToBase16,
    base64ToBase16: base64ToBase16
});

const helpers = {
    object: objectHelpers,
    string: stringHelpers
};

function isObject(x) {
    return (x !== null && typeof x === "object");
}
/**
 * A plain object is considered as follows:
 * - It must not be null.
 * - It must be an object.
 * - It must have a prototype of `Object.prototype` or `null`.
*/
function isPlainObject(x) {
    if (x === null || typeof x !== "object")
        return (false);
    const prototype = Object.getPrototypeOf(x);
    return (prototype === null || prototype === Object.prototype);
}
// ARRAY
function isArray(x) {
    return (Array.isArray(x));
}
/**
 * A typed array is considered as follows:
 * - It must be a view on an ArrayBuffer.
 * - It must not be a `DataView`.
 */
function isTypedArray(x) {
    return (ArrayBuffer.isView(x) && !(x instanceof DataView));
}
// FUNCTION
function isFunction(x) {
    return (getInternalTag(x) === "Function");
}
function isAsyncFunction(x) {
    return (getInternalTag(x) === "AsyncFunction");
}
function isGeneratorFunction(x) {
    return (getInternalTag(x) === "GeneratorFunction");
}
function isAsyncGeneratorFunction(x) {
    return (getInternalTag(x) === "AsyncGeneratorFunction");
}

var objectTesters = /*#__PURE__*/Object.freeze({
    __proto__: null,
    isArray: isArray,
    isAsyncFunction: isAsyncFunction,
    isAsyncGeneratorFunction: isAsyncGeneratorFunction,
    isFunction: isFunction,
    isGeneratorFunction: isGeneratorFunction,
    isObject: isObject,
    isPlainObject: isPlainObject,
    isTypedArray: isTypedArray
});

/**
 * Check if all characters of the string are in the ASCII table (%d0-%d127).
 *
 * If you enable `onlyPrintable` valid characters will be limited to
 * printable characters from the ASCII table (%32-%d126).
 *
 * Empty returns `false`.
 */
function isAscii(str, options) {
    if (options?.onlyPrintable)
        return (RegExp("^[\\x20-\\x7E]+$").test(str));
    return (RegExp("^[\\x00-\\x7F]+$").test(str));
}

/*
Composition :
    DIGIT    = %x30-39
    HEXDIG   = DIGIT / "A" / "B" / "C" / "D" / "E" / "F"
    hexOctet = HEXDIG HEXDIG
    uuid     = 4*4hexOctet "-"
               2*2hexOctet "-"
               2*2hexOctet "-"
               2*2hexOctet "-"
               6*6hexOctet

Sources :
    RFC 9562 Section 4 : DIGIT
                         HEXDIG
                         hexOctet
                         UUID -> uuid

Links :
    https://datatracker.ietf.org/doc/html/rfc9562#section-4
*/
const extractUuidVersionRegex = new RegExp("^[0-9A-F]{8}-[0-9A-F]{4}-([1-7])[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$", "i");
/**
 * **Standard :** RFC 9562
 *
 * @version 1.0.0
 */
function isUuid(str, params) {
    const extracted = extractUuidVersionRegex.exec(str);
    if (!extracted || !extracted[1])
        return (false);
    if (!params?.version || (extracted[1].codePointAt(0) - 48) === params?.version)
        return (true);
    return (false);
}

function weakly(callback) {
    let ref = null;
    return (() => {
        if (!ref) {
            const obj = callback();
            ref = new WeakRef(obj);
            return (obj);
        }
        const value = ref.deref();
        if (!value) {
            const obj = callback();
            ref = new WeakRef(obj);
            return (obj);
        }
        return (value);
    });
}

/**
# IPV4

Composition :
    dec-octet = 1*3DIGIT ; Representing a decimal integer value in the range 0 through 255
    prefix    = 1*2DIGIT ; Representing a decimal integer value in the range 0 through 32.
    IPv4      = dec-octet 3("." dec-octet) ["/" prefix]

# IPV6

Composition :
    HEXDIG      = DIGIT / A-F / a-f
    IPv6-full   = 1*4HEXDIG 7(":" 1*4HEXDIG)
    IPv6-comp   = [1*4HEXDIG *5(":" 1*4HEXDIG)] "::" [1*4HEXDIG *5(":" 1*4HEXDIG)]
    IPv6v4-full = 1*4HEXDIG 5(":" 1*4HEXDIG) ":" IPv4
    IPv6v4-comp = [1*4HEXDIG *3(":" 1*4HEXDIG)] "::" [1*4HEXDIG *3(":" 1*4HEXDIG) ":"] IPv4
    prefix      = 1*3DIGIT ; Representing a decimal integer value in the range 0 through 128.
    IPv6        = (IPv6-full / IPv6-comp / IPv6v4-full / IPv6v4-comp) ["/" prefix]
*/
const ipV4Seg = "(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])";
const ipV4Pattern = `(?:${ipV4Seg}\\.){3}${ipV4Seg}`;
const ipV4SimpleRegex = new RegExp(`^${ipV4Pattern}$`);
const ipV4PrefixRegex = weakly(() => new RegExp(`^${ipV4Pattern}/(3[0-2]|[12]?[0-9])$`));
const ipV6Seg = "(?:[0-9a-fA-F]{1,4})";
const ipV6Pattern = "(?:" +
    `(?:${ipV6Seg}:){7}(?:${ipV6Seg}|:)|` +
    `(?:${ipV6Seg}:){6}(?:${ipV4Pattern}|:${ipV6Seg}|:)|` +
    `(?:${ipV6Seg}:){5}(?::${ipV4Pattern}|(?::${ipV6Seg}){1,2}|:)|` +
    `(?:${ipV6Seg}:){4}(?:(?::${ipV6Seg}){0,1}:${ipV4Pattern}|(?::${ipV6Seg}){1,3}|:)|` +
    `(?:${ipV6Seg}:){3}(?:(?::${ipV6Seg}){0,2}:${ipV4Pattern}|(?::${ipV6Seg}){1,4}|:)|` +
    `(?:${ipV6Seg}:){2}(?:(?::${ipV6Seg}){0,3}:${ipV4Pattern}|(?::${ipV6Seg}){1,5}|:)|` +
    `(?:${ipV6Seg}:){1}(?:(?::${ipV6Seg}){0,4}:${ipV4Pattern}|(?::${ipV6Seg}){1,6}|:)|` +
    `(?::(?:(?::${ipV6Seg}){0,5}:${ipV4Pattern}|(?::${ipV6Seg}){1,7}|:)))`;
const ipV6SimpleRegex = new RegExp(`^${ipV6Pattern}$`);
const ipV6PrefixRegex = weakly(() => new RegExp(`^${ipV6Pattern}/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$`));
/**
 * **Standard:** No standard
 *
 * @version 1.0.0
 */
function isIp(str, params) {
    if (!params?.allowPrefix && ipV4SimpleRegex.test(str))
        return (true);
    else if (params?.allowPrefix && ipV4PrefixRegex().test(str))
        return (true);
    if (!params?.allowPrefix && ipV6SimpleRegex.test(str))
        return (true);
    else if (params?.allowPrefix && ipV6PrefixRegex().test(str))
        return (true);
    return (false);
}
/**
 * **Standard:** No standard
 *
 * @version 1.0.0
 */
function isIpV4(str, params) {
    if (!params?.allowPrefix && ipV4SimpleRegex.test(str))
        return (true);
    else if (params?.allowPrefix && ipV4PrefixRegex().test(str))
        return (true);
    return (false);
}
/**
 * **Standard:** No standard
 *
 * @version 1.0.0
 */
function isIpV6(str, params) {
    if (!params?.allowPrefix && ipV4SimpleRegex.test(str))
        return (true);
    else if (params?.allowPrefix && ipV4PrefixRegex().test(str))
        return (true);
    return (false);
}

/*
Composition :
    letter = %d65-%d90 / %d97-%d122; A-Z / a-z
    digit  = %x30-39; 0-9
    label  = letter [*(digit / letter / "-") digit / letter]
    domain = label *("." label)

Links :
    https://datatracker.ietf.org/doc/html/rfc1035#section-2.3.1
*/
const domainRegex = new RegExp("^[A-Za-z](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\\.[A-Za-z](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*$");
/**
 * **Standard :** RFC 1035
 *
 * @version 1.0.0
 */
function isDomain(str, options) {
    return (domainRegex.test(str));
}

/*
Composition :
    atom            = 1*atext
    dot-local       = atom *("."  atom)
    quoted-local    = DQUOTE *QcontentSMTP DQUOTE
    ip-address      = IPv4-address-literal / IPv6-address-literal
    general-address = General-address-literal
    local           = dot-local / quote-local
    domain          = Domain
    address         = ip-address / general-address
    mailbox         = local "@" (domain / address)

Sources :
    RFC 5234 Appendix B.1   : DQUOTE
    RFC 5322 Section  3.2.3 : atext
    RFC 5321 Section  4.1.3 : IPv4-address-literal
                              IPv6-address-literal
                              General-address-literal
    RFC 5321 Section  4.1.2 : QcontentSMTP
                              Domain

Links :
    https://datatracker.ietf.org/doc/html/rfc5234#appendix-B.1
    https://datatracker.ietf.org/doc/html/rfc5322#section-3.2.3
    https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.3
    https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.2
*/
const dotStringPattern = "(?:[-!=?A-B\\x23-\\x27\\x2A-\\x2B\\x2F-\\x39\\x5E-\\x7E]+(?:\\.[-!=?A-B\\x23-\\x27\\x2A-\\x2B\\x2F-\\x39\\x5E-\\x7E]+)*)";
const quotedStringPattern = "(?:\"(?:[\\x20-\\x21\\x23-\\x5B\\x5D-\\x7E]|\\\\[\\x20-\\x7E])*\")";
const dotLocalRegex = new RegExp(`^${dotStringPattern}$`);
const dotOrQuoteLocalRegex = weakly(() => new RegExp(`^(?:${dotStringPattern}|${quotedStringPattern})$`));
const ipAddressRegex = weakly(() => new RegExp(`^\\[(?:IPv6:${ipV6Pattern}|${ipV4Pattern})\\]$`));
const generalAddressRegex = weakly(() => new RegExp(`(?:[a-zA-Z0-9-]*[a-zA-Z0-9]+:[\\x21-\\x5A\\x5E-\\x7E]+)`));
function parseEmail(str) {
    const length = str.length;
    let i = 0;
    // EXTRACT LOCAL
    const localStart = i;
    if (str[localStart] === "\"") {
        while (++i < length) {
            if (str[i] === "\\")
                i++;
            else if (str[i] === "\"") {
                i++;
                break;
            }
        }
    }
    else {
        while (i < length && str[i] !== "@")
            i++;
    }
    if (i === localStart || str[i] !== "@")
        return (null);
    const localEnd = i;
    // EXTRACT DOMAIN
    const domainStart = ++i;
    const domainEnd = length;
    if (domainStart === domainEnd)
        return (null);
    return ({
        local: str.slice(localStart, localEnd),
        domain: str.slice(domainStart, domainEnd)
    });
}
function isValidLocal(str, options) {
    if (dotLocalRegex.test(str))
        return (true);
    if (options?.allowQuotedString
        && dotOrQuoteLocalRegex().test(str))
        return (true);
    return (false);
}
function isValidDomain(str, options) {
    if (isDomain(str))
        return (true);
    if (options?.allowIpAddress
        && ipAddressRegex().test(str))
        return (true);
    if (options?.allowGeneralAddress
        && generalAddressRegex().test(str))
        return (true);
    return (false);
}
/**
 * **Standard :** RFC 5321
 *
 * @version 2.0.0
 */
function isEmail(str, options) {
    const email = parseEmail(str);
    if (!email)
        return (false);
    // CHECK LOCAL
    if (!isValidLocal(email.local, options))
        return (false);
    // CHECK DOMAIN
    if (!isValidDomain(email.domain, options))
        return (false);
    // RFC 5321 4.5.3.1.2 : Length restriction
    if (!email.domain.length || email.domain.length > 255)
        return (false);
    return (true);
}

/*
Composition :
    data      = pchar
    value     = value
    token     = restricted-name
    mediatype = [token "/" token] *(";" token "=" value)
    dataurl   = "data:" [mediatype] [";base64"] "," data

Sources :
    RFC 3986 Section 3.3 : pchar
    RFC 2045 Section 5.1 : value
    RFC 6838 Section 4.2 : restricted-name

Links :
    https://datatracker.ietf.org/doc/html/rfc3986#section-3.3
    https://datatracker.ietf.org/doc/html/rfc2045#section-5.1
    https://datatracker.ietf.org/doc/html/rfc6838#section-4.2
    https://datatracker.ietf.org/doc/html/rfc2397#section-3
*/
const paramTokenPattern = "[a-zA-Z0-9!#$%&'*+.^_`{|}~-]+";
const paramTokenQuotePattern = "\"[a-zA-Z0-9!#$%&'()*+,./:;<=>?@\[\\\]^_`{|}~-]+\"";
const valueRegex = new RegExp(`^(?:${paramTokenPattern}|${paramTokenQuotePattern})$`);
const tokenRegex = new RegExp(`^[a-zA-Z0-9](?:[a-zA-Z0-9!#$&^/_.+-]{0,125}[a-zA-Z0-9!#$&^/_.-])?$`);
const dataRegex = new RegExp(`^(?:[a-zA-Z0-9._~!$&'()*+,;=:@-]|%[a-zA-Z0-9]{2})*$`);
function parseDataUrl(str) {
    const result = {
        data: "",
        type: "",
        subtype: "",
        parameters: [],
        isBase64: false
    };
    let i = 0;
    if (!str.startsWith("data:"))
        return (null);
    i += 5;
    if (str[i] !== ";" && str[i] !== ",") {
        // EXTRACT TYPE
        const typeStart = i;
        while (str[i] && str[i] !== "/")
            i++;
        if (!str[i] || typeStart === i)
            return (null);
        const typeEnd = i;
        // EXTRACT SUBTYPE
        const subtypeStart = ++i;
        while (str[i] && str[i] !== ";" && str[i] !== ",")
            i++;
        if (!str[i] || subtypeStart === i)
            return (null);
        const subtypeEnd = i;
        result.type = str.slice(typeStart, typeEnd);
        result.subtype = str.slice(subtypeStart, subtypeEnd);
    }
    // EXTRACT PARAMETERS
    while (str[i] && str[i] === ";") {
        if (str.startsWith(";base64,", i)) {
            result.isBase64 = true;
            i += 7;
            break;
        }
        const nameStart = ++i;
        while (str[i] && str[i] !== "=")
            i++;
        if (!str[i] || nameStart === i)
            return (null);
        const nameEnd = i;
        const valueStart = ++i;
        if (str[valueStart] === "\"") {
            while (str[i] && !(str[i - 1] === "\"" && (str[i] === ";" || str[i] === ",")))
                i++;
        }
        else {
            while (str[i] && str[i] !== ";" && str[i] !== ",")
                i++;
        }
        if (!str[i] || valueStart === i)
            return (null);
        const valueEnd = i;
        result.parameters.push({
            name: str.slice(nameStart, nameEnd),
            value: str.slice(valueStart, valueEnd)
        });
    }
    if (str[i] !== ",")
        return (null);
    i += 1;
    // EXTRACT DATA
    if (str[i])
        result.data = str.slice(i);
    return (result);
}
/**
 * **Standard :** RFC 2397 (RFC 2045, RFC 6838, RFC 3986)
 *
 * @version 2.0.0
 */
function isDataUrl(str, options) {
    const dataUrl = parseDataUrl(str);
    if (!dataUrl)
        return (false);
    if (dataUrl.type || dataUrl.subtype) {
        // CHECK TYPE
        if (!tokenRegex.test(dataUrl.type))
            return (false);
        // RFC 6838 4.2: Length restriction
        if (dataUrl.type.length > 127)
            return (false);
        // CHECK SUBTYPE
        if (!tokenRegex.test(dataUrl.subtype))
            return (false);
        // RFC 6838 4.2: Length restriction
        if (dataUrl.subtype.length > 127)
            return (false);
    }
    // CHECK PARAMETERS
    for (let i = 0; i < dataUrl.parameters.length; i++) {
        const parameter = dataUrl.parameters[i];
        if (!tokenRegex.test(parameter.name))
            return (false);
        if (!valueRegex.test(parameter.value))
            return (false);
        // RFC 6838 4.3: Identical name restriction and case insensitive
        if (dataUrl.parameters.some(({ name }, j) => j !== i && name.toLowerCase() === name.toLowerCase()))
            return (false);
    }
    // CHECK DATA
    if (!dataRegex.test(dataUrl.data))
        return (false);
    if (options?.type) {
        const hasValidType = options.type.some(type => type.toLowerCase() === dataUrl.type.toLowerCase());
        if (!hasValidType)
            return (false);
    }
    if (options?.subtype) {
        const hasValidSubtype = options.subtype.some(subtype => subtype.toLowerCase() === dataUrl.subtype.toLowerCase());
        if (!hasValidSubtype)
            return (false);
    }
    return (true);
}

const base16Regex = new RegExp("^(?:[A-F0-9]{2})*$");
const base32Regex = new RegExp("^(?:[A-Z2-7]{8})*(?:[A-Z2-7]{2}[=]{6}|[A-Z2-7]{4}[=]{4}|[A-Z2-7]{5}[=]{3}|[A-Z2-7]{6}[=]{2}|[A-Z2-7]{7}[=]{1})?$");
const base32HexRegex = weakly(() => new RegExp("^(?:[0-9A-V]{8})*(?:[0-9A-V]{2}[=]{6}|[0-9A-V]{4}[=]{4}|[0-9A-V]{5}[=]{3}|[0-9A-V]{6}[=]{2}|[0-9A-V]{7}[=]{1})?$"));
const base64Regex = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}[=]{2}|[A-Za-z0-9+/]{3}[=]{1})?$");
const base64UrlRegex = weakly(() => new RegExp("^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2}[=]{2}|[A-Za-z0-9_-]{3}[=]{1})?$"));
/**
 * **Standard :** RFC 4648
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-4
 *
 * @version 1.0.0
 */
function isBase64(str, options) {
    if (typeof str !== "string")
        new Issue("Parameters", "'str' must be of type string.");
    return (str.length % 4 == 0 && base64Regex.test(str));
}
/**
 * **Standard :** RFC 4648
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-5
 *
 * @version 1.0.0
 */
function isBase64Url(str, options) {
    if (typeof str !== "string")
        new Issue("Parameters", "'str' must be of type string.");
    return (str.length % 4 === 0 && base64UrlRegex().test(str));
}
/**
 * **Standard :** RFC 4648
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-6
 *
 * @version 1.0.0
 */
function isBase32(str, options) {
    if (typeof str !== "string")
        new Issue("Parameters", "'str' must be of type string.");
    return (str.length % 8 === 0 && base32Regex.test(str));
}
/**
 * **Standard :** RFC 4648
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-7
 *
 * @version 1.0.0
 */
function isBase32Hex(str, options) {
    if (typeof str !== "string")
        new Issue("Parameters", "'str' must be of type string.");
    return (str.length % 8 === 0 && base32HexRegex().test(str));
}
/**
 * **Standard :** RFC 4648
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-8
 *
 * @version 1.0.0
 */
function isBase16(str, options) {
    if (typeof str !== "string")
        new Issue("Parameters", "'str' must be of type string.");
    return (str.length % 2 === 0 && base16Regex.test(str));
}

var stringTesters$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    isAscii: isAscii,
    isBase16: isBase16,
    isBase32: isBase32,
    isBase32Hex: isBase32Hex,
    isBase64: isBase64,
    isBase64Url: isBase64Url,
    isDataUrl: isDataUrl,
    isDomain: isDomain,
    isEmail: isEmail,
    isIp: isIp,
    isIpV4: isIpV4,
    isIpV6: isIpV6,
    isUuid: isUuid
});

const testers = {
    object: objectTesters,
    string: stringTesters$1
};

const nodeSymbol = Symbol("node");
const commonErrors = {
    NODE_MALFORMED: "Criteria node must be of type Plain Object.",
    TYPE_PROPERTY_REQUIRED: "",
    TYPE_PROPERTY_MALFORMED: "",
    TYPE_PROPERTY_MISCONFIGURED: "",
    LABEL_PROPERTY_MALFORMED: "",
    MESSAGE_PROPERTY_MALFORMED: "",
    NULLABLE_PROPERTY_MALFORMED: ""
};
function commonMount(managers, node) {
    if (!isPlainObject(node))
        return ("NODE_MALFORMED");
    const { type, label, message, nullable } = node;
    if (!("type" in node)) {
        return ("TYPE_PROPERTY_REQUIRED");
    }
    if (typeof type !== "string") {
        return ("TYPE_PROPERTY_MALFORMED");
    }
    if (!managers.formats.has(type)) {
        return ("TYPE_PROPERTY_MISCONFIGURED");
    }
    if (label !== undefined && typeof label !== "string") {
        return ("LABEL_PROPERTY_MALFORMED");
    }
    if (message !== undefined && typeof message !== "string") {
        return ("MESSAGE_PROPERTY_MALFORMED");
    }
    if (nullable !== undefined && typeof nullable !== "boolean") {
        return ("NULLABLE_PROPERTY_MALFORMED");
    }
    return (null);
}
function hasNodeSymbol(obj) {
    return (typeof obj === "object" && Reflect.has(obj, nodeSymbol));
}
class MounterStack {
    constructor(rootNode) {
        this.tasks = [];
        this.tasks.push({
            node: rootNode,
            partPath: { explicit: [], implicit: [] },
            fullPath: { explicit: [], implicit: [] }
        });
    }
    pushChunk(sourceTask, chunk) {
        const { explicit: fullPathExplicit, implicit: fullPathImplicit } = sourceTask.fullPath;
        for (let i = 0; i < chunk.length; i++) {
            const { node, partPath } = chunk[i];
            this.tasks.push({
                node,
                partPath,
                fullPath: {
                    explicit: partPath.explicit
                        ? fullPathExplicit.concat(partPath.explicit)
                        : fullPathExplicit,
                    implicit: partPath.implicit
                        ? fullPathImplicit.concat(partPath.implicit)
                        : fullPathImplicit
                }
            });
        }
    }
}
function mounter(managers, rootNode) {
    const { formats, events } = managers;
    const stack = new MounterStack(rootNode);
    while (stack.tasks.length) {
        const currentTask = stack.tasks.pop();
        const { node, partPath, fullPath } = currentTask;
        if (hasNodeSymbol(node)) {
            node[nodeSymbol] = {
                ...node[nodeSymbol],
                partPath
            };
        }
        else {
            let code = null;
            code = commonMount(managers, node);
            if (code) {
                throw new SchemaNodeException({
                    node: node,
                    nodePath: fullPath,
                    code: code,
                    message: commonErrors[code]
                });
            }
            const chunk = [];
            const format = formats.get(node.type);
            code = format.mount(chunk, node);
            if (code) {
                throw new SchemaNodeException({
                    node: node,
                    nodePath: fullPath,
                    code: code,
                    message: format.exceptions[code]
                });
            }
            Object.assign(node, {
                [nodeSymbol]: {
                    partPath,
                    childNodes: chunk.map((task) => task.node)
                }
            });
            Object.freeze(node);
            if (chunk.length)
                stack.pushChunk(currentTask, chunk);
            events.emit("NODE_MOUNTED", node, fullPath);
        }
    }
    events.emit("TREE_MOUNTED", rootNode);
    return rootNode;
}

class CheckerStack {
    constructor(rootNode, rootData) {
        this.tasks = [];
        this.tasks.push({
            data: rootData,
            node: rootNode,
            fullPath: { explicit: [], implicit: [] }
        });
    }
    pushChunk(sourceTask, chunk) {
        const { explicit: fullPathExplicit, implicit: fullPathImplicit } = sourceTask.fullPath;
        for (let i = 0; i < chunk.length; i++) {
            const task = chunk[i];
            const partPath = task.node[nodeSymbol].partPath;
            let stackHooks = sourceTask.stackHooks;
            if (task.hooks) {
                const hooks = {
                    taskOwner: sourceTask,
                    stackIndex: {
                        chunk: this.tasks.length - i,
                        branch: this.tasks.length
                    },
                    ...task.hooks
                };
                stackHooks = stackHooks ? stackHooks.concat(hooks) : [hooks];
            }
            this.tasks.push({
                data: task.data,
                node: task.node,
                fullPath: {
                    explicit: partPath.explicit
                        ? fullPathExplicit.concat(partPath.explicit)
                        : fullPathExplicit,
                    implicit: partPath.implicit
                        ? fullPathImplicit.concat(partPath.implicit)
                        : fullPathImplicit
                },
                stackHooks
            });
        }
    }
    callHooks(sourceTask, rejection) {
        const stackHooks = sourceTask.stackHooks;
        if (!stackHooks)
            return (null);
        const lastHooks = stackHooks[stackHooks.length - 1];
        if (!rejection && lastHooks.stackIndex.branch !== this.tasks.length) {
            return (null);
        }
        loop: for (let i = stackHooks.length - 1; i >= 0; i--) {
            const hooks = stackHooks[i];
            const claim = rejection ? hooks.onReject(rejection) : hooks.onAccept();
            switch (claim.action) {
                case "DEFAULT":
                    this.tasks.length = hooks.stackIndex.branch;
                    if (!rejection) {
                        rejection = null;
                        break loop;
                    }
                    continue;
                case "REJECT":
                    this.tasks.length = hooks.stackIndex.branch;
                    rejection = { task: hooks.taskOwner, code: claim.code };
                    continue;
                case "IGNORE":
                    if (claim?.target === "CHUNK") {
                        this.tasks.length = hooks.stackIndex.chunk;
                    }
                    else {
                        this.tasks.length = hooks.stackIndex.branch;
                    }
                    rejection = null;
                    break loop;
            }
        }
        return (rejection);
    }
}
function checker(managers, rootNode, rootData) {
    const { formats, events } = managers;
    const stack = new CheckerStack(rootNode, rootData);
    let rejection = null;
    while (stack.tasks.length) {
        const currentTask = stack.tasks.pop();
        const { data, node, stackHooks } = currentTask;
        const chunk = [];
        let code = null;
        if (!(node.nullable && data === null)) {
            const format = formats.get(node.type);
            code = format.check(chunk, node, data);
        }
        if (code)
            rejection = { task: currentTask, code };
        else if (chunk.length)
            stack.pushChunk(currentTask, chunk);
        if (stackHooks)
            rejection = stack.callHooks(currentTask, rejection);
        if (rejection)
            break;
    }
    events.emit("DATA_CHECKED", rootNode, rootData, rejection);
    return (rejection);
}

/**
 * Clones the object starting from the root and stops traversing a branch
 * when a mounted criteria node is encountered. In such cases, the mounted
 * object encountered see its internal properties copied to a new reference
 * so that the junction is a unique reference in the tree.
 *
 * @param src Source object of the clone
 * @returns Clone of the source object
 */
function cloner(rootSrc) {
    let rootCpy = {};
    let stack = [{
            src: rootSrc,
            cpy: rootCpy
        }];
    while (stack.length > 0) {
        let { src, cpy } = stack.pop();
        if (isPlainObject(src)) {
            if (hasNodeSymbol(src)) {
                cpy = { ...src };
            }
            else {
                const keys = Reflect.ownKeys(src);
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    if (isPlainObject(src[key])) {
                        if (hasNodeSymbol(src[key])) {
                            cpy[key] = { ...src[key] };
                        }
                        else {
                            cpy[key] = {};
                            stack.push({
                                src: src[key],
                                cpy: cpy[key]
                            });
                        }
                    }
                    else if (isArray(src[key])) {
                        cpy[key] = [];
                        stack.push({
                            src: src[key],
                            cpy: cpy[key]
                        });
                    }
                    else {
                        cpy[key] = src[key];
                    }
                }
            }
        }
        else if (isArray(src)) {
            for (let i = 0; i < src.length; i++) {
                const index = i;
                if (isPlainObject(src[index])) {
                    if (hasNodeSymbol(src[index])) {
                        cpy[i] = { ...src[index] };
                    }
                    else {
                        cpy[i] = {};
                        stack.push({
                            src: src[index],
                            cpy: cpy[index]
                        });
                    }
                }
                else if (isArray(src[index])) {
                    cpy[index] = [];
                    stack.push({
                        src: src[index],
                        cpy: cpy[index]
                    });
                }
                else {
                    cpy[index] = src[index];
                }
            }
        }
        else {
            cpy = src;
        }
    }
    return rootCpy;
}

const FunctionFormat = {
    type: "function",
    exceptions: {
        NATURE_PROPERTY_MALFORMED: "The 'nature' property must be of type String.",
        NATURE_PROPERTY_STRING_MISCONFIGURED: "The 'nature' property must be a known string.",
        NATURE_PROPERTY_ARRAY_LENGTH_MISCONFIGURED: "The array length of the 'nature' must be greater than 0.",
        NATURE_PROPERTY_ARRAY_ITEM_MISCONFIGURED: "The array items of the 'nature' property must be a known string."
    },
    natureBitflags: {
        BASIC: 1 << 1,
        ASYNC: 1 << 2,
        BASIC_GENERATOR: 1 << 3,
        ASYNC_GENERATOR: 1 << 4
    },
    tagBitflags: {
        Function: 1 << 1,
        AsyncFunction: 1 << 2,
        GeneratorFunction: 1 << 3,
        AsyncGeneratorFunction: 1 << 4
    },
    mount(chunk, criteria) {
        const { nature } = criteria;
        if (nature !== undefined) {
            if (typeof nature == "string") {
                if (!(nature in this.natureBitflags)) {
                    return ("NATURE_PROPERTY_STRING_MISCONFIGURED");
                }
            }
            else if (isArray(nature)) {
                if (nature.length < 1) {
                    return ("NATURE_PROPERTY_ARRAY_LENGTH_MISCONFIGURED");
                }
                for (const item of nature) {
                    if (!(item in this.natureBitflags)) {
                        return ("NATURE_PROPERTY_ARRAY_ITEM_MISCONFIGURED");
                    }
                }
            }
            else {
                return ("NATURE_PROPERTY_MALFORMED");
            }
        }
        if (isArray(nature)) {
            Object.assign(criteria, {
                natureBitcode: nature.reduce((code, key) => (code | this.natureBitflags[key]), 0)
            });
        }
        else {
            Object.assign(criteria, {
                natureBitcode: nature
                    ? this.natureBitflags[nature]
                    : 0
            });
        }
        return (null);
    },
    check(chunk, criteria, value) {
        if (typeof value !== "function") {
            return ("TYPE_FUNCTION_UNSATISFIED");
        }
        const { natureBitcode } = criteria;
        const { tagBitflags } = this;
        if (natureBitcode) {
            const tag = getInternalTag(value);
            const tagBitflag = tagBitflags[tag];
            if (!tagBitflag || !(natureBitcode & tagBitflag)) {
                return ("NATURE_UNSATISFIED");
            }
        }
        return (null);
    }
};

const BooleanFormat = {
    type: "boolean",
    exceptions: {
        LITERAL_PROPERTY_MALFORMED: "The 'literal' property must be of type Boolean."
    },
    mount(chunk, criteria) {
        const { literal } = criteria;
        if (literal !== undefined && typeof literal !== "boolean") {
            return ("LITERAL_PROPERTY_MALFORMED");
        }
        return (null);
    },
    check(chunk, criteria, value) {
        if (typeof value !== "boolean") {
            return ("TYPE_BOOLEAN_UNSATISFIED");
        }
        const { literal } = criteria;
        if (literal !== undefined && literal !== value) {
            return ("LITERAL_UNSATISFIED");
        }
        return (null);
    },
};

const SymbolFormat = {
    type: "symbol",
    exceptions: {
        LITERAL_PROPERTY_MALFORMED: "The 'literal' property must be of type Symbol, Array or Plain Object.",
        LITERAL_PROPERTY_ARRAY_MISCONFIGURED: "The array of the 'literal' property must contain at least one item.",
        LITERAL_PROPERTY_ARRAY_ITEM_MALFORMED: "The array items of the 'literal' property must be of type Symbol.",
        LITERAL_PROPERTY_OBJECT_MISCONFIGURED: "The object of the 'literal' property must contain at least one key.",
        LITERAL_PROPERTY_OBJECT_KEY_MALFORMED: "The object keys of the 'literal' property must be of type String.",
        LITERAL_PROPERTY_OBJECT_VALUE_MALFORMED: "The object values of the 'literal' property must be of type Symbol.",
    },
    mount(chunk, criteria) {
        const { literal } = criteria;
        if (literal !== undefined) {
            let resolvedLiteral;
            if (typeof literal === "symbol") {
                resolvedLiteral = new Set([literal]);
            }
            else if (isArray(literal)) {
                if (literal.length < 1) {
                    return ("LITERAL_PROPERTY_ARRAY_MISCONFIGURED");
                }
                for (const item of literal) {
                    if (typeof item !== "symbol") {
                        return ("LITERAL_PROPERTY_ARRAY_ITEM_MALFORMED");
                    }
                }
                resolvedLiteral = new Set(literal);
            }
            else if (isPlainObject(literal)) {
                const keys = Reflect.ownKeys(literal);
                if (keys.length < 1) {
                    return ("LITERAL_PROPERTY_OBJECT_MISCONFIGURED");
                }
                for (const key of keys) {
                    if (typeof key !== "string") {
                        return ("LITERAL_PROPERTY_OBJECT_KEY_MALFORMED");
                    }
                    if (typeof literal[key] !== "symbol") {
                        return ("LITERAL_PROPERTY_OBJECT_VALUE_MALFORMED");
                    }
                }
                resolvedLiteral = new Set(Object.values(literal));
            }
            else {
                return ("LITERAL_PROPERTY_MALFORMED");
            }
            Object.assign(criteria, { resolvedLiteral });
        }
        return (null);
    },
    check(chunk, criteria, value) {
        if (typeof value !== "symbol") {
            return ("TYPE_SYMBOL_UNSATISFIED");
        }
        const { resolvedLiteral } = criteria;
        if (resolvedLiteral !== undefined && !resolvedLiteral.has(value)) {
            return ("LITERAL_UNSATISFIED");
        }
        return (null);
    }
};

const NumberFormat = {
    type: "number",
    exceptions: {
        MIN_PROPERTY_MALFORMED: "The 'min' property must be of type Number.",
        MAX_PROPERTY_MALFORMED: "The 'max' property must be of type Number.",
        MIN_AND_MAX_PROPERTIES_MISCONFIGURED: "The 'min' property cannot be greater than 'max' property.",
        LITERAL_PROPERTY_MALFORMED: "The 'literal' property must be of type Number, Array or Plain Object.",
        LITERAL_PROPERTY_ARRAY_MISCONFIGURED: "The array of the 'literal' property must contain at least one item.",
        LITERAL_PROPERTY_ARRAY_ITEM_MALFORMED: "The array items of the 'literal' property must be of type Number.",
        LITERAL_PROPERTY_OBJECT_MISCONFIGURED: "The object of the 'literal' property must contain at least one key.",
        LITERAL_PROPERTY_OBJECT_KEY_MALFORMED: "The object keys of the 'literal' property must be of type String.",
        LITERAL_PROPERTY_OBJECT_VALUE_MALFORMED: "The object values of the 'literal' property must be of type Number.",
        CUSTOM_PROPERTY_MALFORMED: "The 'custom' property must be of type Basic Function."
    },
    mount(chunk, criteria) {
        const { min, max, literal, custom } = criteria;
        if (min !== undefined && typeof min !== "number") {
            return ("MIN_PROPERTY_MALFORMED");
        }
        if (max !== undefined && typeof max !== "number") {
            return ("MAX_PROPERTY_MALFORMED");
        }
        if (min !== undefined && max !== undefined && min > max) {
            return ("MIN_AND_MAX_PROPERTIES_MISCONFIGURED");
        }
        if (literal !== undefined) {
            let resolvedLiteral;
            if (typeof literal === "number") {
                resolvedLiteral = new Set([literal]);
            }
            else if (isArray(literal)) {
                if (literal.length < 1) {
                    return ("LITERAL_PROPERTY_ARRAY_MISCONFIGURED");
                }
                for (const item of literal) {
                    if (typeof item !== "number") {
                        return ("LITERAL_PROPERTY_ARRAY_ITEM_MALFORMED");
                    }
                }
                resolvedLiteral = new Set(literal);
            }
            else if (isPlainObject(literal)) {
                const keys = Reflect.ownKeys(literal);
                if (keys.length < 1) {
                    return ("LITERAL_PROPERTY_OBJECT_MISCONFIGURED");
                }
                for (const key of keys) {
                    if (typeof key !== "string") {
                        return ("LITERAL_PROPERTY_OBJECT_KEY_MALFORMED");
                    }
                    if (typeof literal[key] !== "number") {
                        return ("LITERAL_PROPERTY_OBJECT_VALUE_MALFORMED");
                    }
                }
                resolvedLiteral = new Set(Object.values(literal));
            }
            else {
                return ("LITERAL_PROPERTY_MALFORMED");
            }
            Object.assign(criteria, { resolvedLiteral });
        }
        if (custom !== undefined && !isFunction(custom)) {
            return ("CUSTOM_PROPERTY_MALFORMED");
        }
        return (null);
    },
    check(chunk, criteria, value) {
        if (typeof value !== "number") {
            return ("TYPE_NUMBER_UNSATISFIED");
        }
        const { min, max, resolvedLiteral, custom } = criteria;
        if (min !== undefined && value < min) {
            return ("MIN_UNSATISFIED");
        }
        if (max !== undefined && value > max) {
            return ("MAX_UNSATISFIED");
        }
        if (resolvedLiteral !== undefined && !resolvedLiteral.has(value)) {
            return ("LITERAL_UNSATISFIED");
        }
        if (custom && !custom(value)) {
            return ("CUSTOM_UNSATISFIED");
        }
        return (null);
    }
};

const stringTesters = new Map(Object.entries(testers.string));
const StringFormat = {
    type: "string",
    exceptions: {
        MIN_PROPERTY_MALFORMED: "The 'min' property must be of type Number.",
        MAX_PROPERTY_MALFORMED: "The 'max' property must be of type Number.",
        MIN_MAX_PROPERTIES_MISCONFIGURED: "The 'min' property cannot be greater than 'max' property.",
        REGEX_PROPERTY_MALFORMED: "The 'regex' property must be of type String or RegExp Object.",
        LITERAL_PROPERTY_MALFORMED: "The 'literal' property must be of type String, Array or Plain Object.",
        LITERAL_PROPERTY_ARRAY_MISCONFIGURED: "The array of the 'literal' property must contain at least one item.",
        LITERAL_PROPERTY_ARRAY_ITEM_MALFORMED: "The array items of the 'literal' property must be of type String.",
        LITERAL_PROPERTY_OBJECT_MISCONFIGURED: "The object of the 'literal' property must contain at least one key.",
        LITERAL_PROPERTY_OBJECT_KEY_MALFORMED: "The object keys of the 'literal' property must be of type String.",
        LITERAL_PROPERTY_OBJECT_VALUE_MALFORMED: "The object values of the 'literal' property must be of type String.",
        CONSTRAINT_PROPERTY_MALFORMED: "The 'constraint' property must be of type Plain Object.",
        CONSTRAINT_PROPERTY_OBJECT_MISCONFIGURED: "The object of the 'constraint' property must contain at least one key.",
        CONSTRAINT_PROPERTY_OBJECT_KEY_MALFORMED: "The object keys of the 'constraint' property must be of type String.",
        CONSTRAINT_PROPERTY_OBJECT_KEY_MISCONFIGURED: "The object keys of the 'constraint' property must be a known string.",
        CONSTRAINT_PROPERTY_OBJECT_VALUE_MALFORMED: "The object values of the 'constraint' property must be of type True or Plain Object.",
        CUSTOM_PROPERTY_MALFORMED: "The 'custom' property must be of type Basic Function."
    },
    mount(chunk, criteria) {
        const { min, max, regex, literal, constraint, custom } = criteria;
        if (min !== undefined && typeof min !== "number") {
            return ("MAX_PROPERTY_MALFORMED");
        }
        if (max !== undefined && typeof max !== "number") {
            return ("MAX_PROPERTY_MALFORMED");
        }
        if (min !== undefined && max !== undefined && min > max) {
            return ("MIN_MAX_PROPERTIES_MISCONFIGURED");
        }
        if (regex !== undefined) {
            if (typeof regex === "string") {
                Object.assign(criteria, {
                    regex: new RegExp(regex)
                });
            }
            else if (!(regex instanceof RegExp)) {
                return ("REGEX_PROPERTY_MALFORMED");
            }
        }
        if (literal !== undefined) {
            let resolvedLiteral;
            if (typeof literal === "string") {
                resolvedLiteral = new Set([literal]);
            }
            else if (isArray(literal)) {
                if (literal.length < 1) {
                    return ("LITERAL_PROPERTY_ARRAY_MISCONFIGURED");
                }
                for (const item of literal) {
                    if (typeof item !== "string") {
                        return ("LITERAL_PROPERTY_ARRAY_ITEM_MALFORMED");
                    }
                }
                resolvedLiteral = new Set(literal);
            }
            else if (isPlainObject(literal)) {
                const keys = Reflect.ownKeys(literal);
                if (keys.length < 1) {
                    return ("LITERAL_PROPERTY_OBJECT_MISCONFIGURED");
                }
                for (const key of keys) {
                    if (typeof key !== "string") {
                        return ("LITERAL_PROPERTY_OBJECT_KEY_MALFORMED");
                    }
                    if (typeof literal[key] !== "string") {
                        return ("LITERAL_PROPERTY_OBJECT_VALUE_MALFORMED");
                    }
                }
                resolvedLiteral = new Set(Object.values(literal));
            }
            else {
                return ("LITERAL_PROPERTY_MALFORMED");
            }
            Object.assign(criteria, { resolvedLiteral });
        }
        if (constraint !== undefined) {
            if (isPlainObject(constraint)) {
                const keys = Reflect.ownKeys(constraint);
                if (keys.length < 1) {
                    return ("CONSTRAINT_PROPERTY_OBJECT_MISCONFIGURED");
                }
                const resolvedConstraint = new Map();
                for (const key of keys) {
                    if (typeof key !== "string") {
                        return ("CONSTRAINT_PROPERTY_OBJECT_KEY_MALFORMED");
                    }
                    if (!stringTesters.has(key)) {
                        return ("CONSTRAINT_PROPERTY_OBJECT_KEY_MISCONFIGURED");
                    }
                    const value = constraint[key];
                    if (typeof value !== "boolean" && !isPlainObject(value)) {
                        return ("CONSTRAINT_PROPERTY_OBJECT_VALUE_MALFORMED");
                    }
                    else if (value === false) {
                        continue;
                    }
                    resolvedConstraint.set(key, value);
                }
                Object.assign(criteria, { resolvedConstraint });
            }
            else {
                return ("CONSTRAINT_PROPERTY_MALFORMED");
            }
        }
        if (custom !== undefined && !isFunction(custom)) {
            return ("CUSTOM_PROPERTY_MALFORMED");
        }
        return (null);
    },
    check(chunk, criteria, value) {
        if (typeof value !== "string") {
            return ("TYPE_STRING_UNSATISFIED");
        }
        const { min, max, regex, resolvedLiteral, resolvedConstraint, custom } = criteria;
        const valueLength = value.length;
        if (min !== undefined && valueLength < min) {
            return ("MIN_UNSATISFIED");
        }
        if (max !== undefined && valueLength > max) {
            return ("MAX_UNSATISFIED");
        }
        if (regex !== undefined && !regex.test(value)) {
            return ("REGEX_UNSATISFIED");
        }
        if (resolvedLiteral !== undefined && !resolvedLiteral.has(value)) {
            return ("LITERAL_UNSATISFIED");
        }
        if (resolvedConstraint !== undefined) {
            let isAccept = false;
            for (const [key, config] of resolvedConstraint) {
                if (stringTesters.get(key)(value, config)) {
                    isAccept = true;
                    break;
                }
            }
            if (!isAccept) {
                return ("CONSTRAINT_UNSATISFIED");
            }
        }
        if (custom && !custom(value)) {
            return ("CUSTOM_UNSATISFIED");
        }
        return (null);
    }
};

const SimpleFormat = {
    type: "simple",
    exceptions: {
        NATURE_PROPERTY_REQUIRED: "The 'nature' property must be defined.",
        NATURE_PROPERTY_MALFORMED: "The 'nature' property must be of type String.",
        NATURE_PROPERTY_STRING_MISCONFIGURED: "The 'nature' property must be a known string."
    },
    natureBitflags: {
        UNKNOWN: 1 << 0,
        NULLISH: 1 << 1,
        NULL: 1 << 2,
        UNDEFINED: 1 << 3
    },
    mount(chunk, criteria) {
        const { nature } = criteria;
        if (!("nature" in criteria)) {
            return ("NATURE_PROPERTY_REQUIRED");
        }
        if (typeof nature !== "string") {
            return ("NATURE_PROPERTY_MALFORMED");
        }
        if (!(nature in this.natureBitflags)) {
            return ("NATURE_PROPERTY_STRING_MISCONFIGURED");
        }
        Object.assign(criteria, {
            natureBitcode: this.natureBitflags[nature]
        });
        return (null);
    },
    check(chunk, criteria, value) {
        const { natureBitcode } = criteria, { natureBitflags } = this;
        if (natureBitcode & natureBitflags.UNKNOWN) {
            return (null);
        }
        if (natureBitcode & natureBitflags.NULLISH && value != null) {
            return ("NATURE_NULLISH_UNSATISFIED");
        }
        if (natureBitcode & natureBitflags.NULL && value !== null) {
            return ("NATURE_NULL_UNSATISFIED");
        }
        if ((natureBitcode & natureBitflags.UNDEFINED) && value !== undefined) {
            return ("NATURE_UNDEFINED_UNSATISFIED");
        }
        return (null);
    }
};

const ObjectFormat = {
    type: "object",
    exceptions: {
        SHAPE_PROPERTY_MALFORMED: "The 'shape' property must be of type Plain Object.",
        SHAPE_PROPERTY_OBJECT_VALUE_MALFORMED: "The object values of the 'shape' property must be of type Plain Object.",
        NATURE_PROPERTY_MALFORMED: "The 'nature' property must be of type String.",
        NATURE_PROPERTY_STRING_MISCONFIGURED: "The 'nature' property must be a known string.",
        OPTIONAL_PROPERTY_MALFORMED: "The 'optional' property must be of type Boolean or Array.",
        OPTIONAL_PROPERTY_ARRAY_ITEM_MALFORMED: "The array items of the 'optional' property must be of type String or Symbol.",
        OPTIONAL_PROPERTY_WITHOUT_SHAPE_PROPERTY_DEFINED: "The 'optional' property cannot be defined without the 'shape' property.",
        ADDITIONAL_PROPERTY_MALFORMED: "The 'additional' property must be of type Boolean or a Plain Object.",
        ADDITIONAL_PROPERTY_WITHOUT_SHAPE_PROPERTY_DEFINED: "The 'additional' property cannot be defined without the 'shape' property.",
        ADDITIONAL__KEY_PROPERTY_MALFORMED: "The 'additional.key' property, must be a criteria node of type Plain Object.",
        ADDITIONAL__KEY_PROPERTY_MISCONFIGURED: "The value of the 'additional.key' property, must be a criteria node with a 'type' property equal to 'string' or 'symbol'",
        ADDITIONAL__VALUE_PROPERTY_MALFORMED: "The 'additional.value' property, must be a criteria node Object.",
        ADDITIONAL__MIN_PROPERTY_MALFORMED: "The 'additional.min' property, must be of type Number.",
        ADDITIONAL__MAX_PROPERTY_MALFORMED: "The 'additional.max' property, must be of type Number.",
        ADDITIONAL__MIN_AND_MAX_PROPERTIES_MISCONFIGURED: "The 'additional.min' property cannot be greater than 'additional.max' property."
    },
    natures: ["STANDARD", "PLAIN"],
    getUnforcedKeys(optional, declaredKeys) {
        if (optional === true)
            return (declaredKeys);
        if (optional === false)
            return ([]);
        return (declaredKeys.filter(key => optional.includes(key)));
    },
    getEnforcedKeys(optional, declaredKeys) {
        if (optional === true)
            return ([]);
        if (optional === false)
            return (declaredKeys);
        return (declaredKeys.filter(key => !optional.includes(key)));
    },
    isShorthandShape(obj) {
        return (isPlainObject(obj) && (!("type" in obj) || typeof obj.type !== "string"));
    },
    mount(chunk, criteria) {
        const { shape, nature, optional, additional } = criteria;
        if (shape !== undefined) {
            if (!isPlainObject(shape)) {
                return ("SHAPE_PROPERTY_MALFORMED");
            }
            for (const key of Reflect.ownKeys(shape)) {
                if (!isPlainObject(shape[key])) {
                    return ("SHAPE_PROPERTY_OBJECT_VALUE_MALFORMED");
                }
            }
        }
        if (nature !== undefined) {
            if (typeof nature !== "string") {
                return ("NATURE_PROPERTY_MALFORMED");
            }
            if (!this.natures.includes(nature)) {
                return ("NATURE_PROPERTY_STRING_MISCONFIGURED");
            }
        }
        if (optional !== undefined) {
            if (!("shape" in criteria)) {
                return ("OPTIONAL_PROPERTY_WITHOUT_SHAPE_PROPERTY_DEFINED");
            }
            if (isArray(optional)) {
                for (const item of optional) {
                    if (typeof item !== "string" && typeof item !== "symbol") {
                        return ("OPTIONAL_PROPERTY_ARRAY_ITEM_MALFORMED");
                    }
                }
            }
            else if (typeof optional !== "boolean") {
                return ("OPTIONAL_PROPERTY_MALFORMED");
            }
        }
        if (additional !== undefined) {
            if (!("shape" in criteria)) {
                return ("ADDITIONAL_PROPERTY_WITHOUT_SHAPE_PROPERTY_DEFINED");
            }
            if (isPlainObject(additional)) {
                const { key, value, min, max } = additional;
                if (isPlainObject(key)) {
                    if (key.type !== "string" && key.type !== "symbol") {
                        return ("ADDITIONAL__KEY_PROPERTY_MISCONFIGURED");
                    }
                }
                else if (key !== undefined) {
                    return ("ADDITIONAL__KEY_PROPERTY_MALFORMED");
                }
                if (value !== undefined && !isPlainObject(value)) {
                    return ("ADDITIONAL__VALUE_PROPERTY_MALFORMED");
                }
                if (min !== undefined && typeof min !== "number") {
                    return ("ADDITIONAL__MIN_PROPERTY_MALFORMED");
                }
                if (max !== undefined && typeof max !== "number") {
                    return ("ADDITIONAL__MAX_PROPERTY_MALFORMED");
                }
                if (min !== undefined && max !== undefined && min > max) {
                    return ("ADDITIONAL__MIN_AND_MAX_PROPERTIES_MISCONFIGURED");
                }
            }
            else if (typeof additional !== "boolean") {
                return ("ADDITIONAL_PROPERTY_MALFORMED");
            }
        }
        const resolvedOptional = optional ?? false;
        const resolvedAdditional = additional ?? false;
        Object.assign(criteria, {
            nature: nature ?? "STANDARD",
            optional: resolvedOptional,
            additional: resolvedAdditional
        });
        if (shape === undefined)
            return (null);
        const declaredKeyArray = Reflect.ownKeys(shape);
        const unforcedKeyArray = this.getUnforcedKeys(resolvedOptional, declaredKeyArray);
        const enforcedKeyArray = this.getEnforcedKeys(resolvedOptional, declaredKeyArray);
        Object.assign(criteria, {
            declaredKeySet: new Set(declaredKeyArray),
            unforcedKeySet: new Set(unforcedKeyArray),
            enforcedKeySet: new Set(enforcedKeyArray)
        });
        for (let i = 0; i < declaredKeyArray.length; i++) {
            const key = declaredKeyArray[i];
            let node = shape[key];
            if (this.isShorthandShape(node)) {
                node = {
                    type: "object",
                    shape: node
                };
                shape[key] = node;
            }
            chunk.push({
                node: node,
                partPath: {
                    explicit: ["shape", key],
                    implicit: ["&", key]
                }
            });
        }
        if (isPlainObject(resolvedAdditional)) {
            if (resolvedAdditional.key) {
                chunk.push({
                    node: resolvedAdditional.key,
                    partPath: {
                        explicit: ["additional", "key"]
                    }
                });
            }
            if (resolvedAdditional.value) {
                chunk.push({
                    node: resolvedAdditional.value,
                    partPath: {
                        explicit: ["additional", "value"],
                        implicit: ["%", "string", "symbol"]
                    }
                });
            }
        }
        return (null);
    },
    check(chunk, criteria, data) {
        if (criteria.nature === "STANDARD") {
            if (!isObject(data)) {
                return ("TYPE_OBJECT_UNSATISFIED");
            }
        }
        else if (!isPlainObject(data)) {
            return ("TYPE_PLAIN_OBJECT_UNSATISFIED");
        }
        const { shape, additional, declaredKeySet, unforcedKeySet, enforcedKeySet } = criteria;
        if (shape === undefined)
            return (null);
        const declaredKeyCount = declaredKeySet.size;
        const enforcedKeyCount = enforcedKeySet.size;
        const definedKeyArray = Reflect.ownKeys(data);
        const definedKeyCount = definedKeyArray.length;
        if (definedKeyCount < enforcedKeyCount) {
            return ("SHAPE_UNSATISFIED");
        }
        if (!additional && definedKeyCount > declaredKeyCount) {
            return ("EXTENSIBLE_UNALLOWED");
        }
        if (typeof additional === "boolean") {
            let enforcedMiss = enforcedKeyCount;
            for (let i = 0; i < definedKeyCount; i++) {
                const key = definedKeyArray[i];
                if (enforcedKeySet.has(key)) {
                    enforcedMiss--;
                }
                else if (enforcedMiss > i) {
                    return ("SHAPE_UNSATISFIED");
                }
                else if (!unforcedKeySet.has(key)) {
                    if (!additional) {
                        return ("EXTENSIBLE_UNALLOWED");
                    }
                    continue;
                }
                chunk.push({
                    data: data[key],
                    node: shape[key]
                });
            }
        }
        else {
            const extendedKeyArray = [];
            const { min, max } = additional;
            let enforcedMiss = enforcedKeyCount;
            for (let i = 0; i < definedKeyCount; i++) {
                const key = definedKeyArray[i];
                if (enforcedKeySet.has(key)) {
                    enforcedMiss--;
                }
                else if (enforcedMiss > i) {
                    return ("SHAPE_UNSATISFIED");
                }
                else if (!unforcedKeySet.has(key)) {
                    extendedKeyArray.push(key);
                    continue;
                }
                chunk.push({
                    data: data[key],
                    node: shape[key]
                });
            }
            const extendedKeyCount = extendedKeyArray.length;
            if (min !== undefined && extendedKeyCount < min) {
                return ("EXTENSIBLE_MIN_UNSATISFIED");
            }
            if (max !== undefined && extendedKeyCount > max) {
                return ("EXTENSIBLE_MAX_UNSATISFIED");
            }
            if (extendedKeyCount && (additional.key || additional.value)) {
                for (let i = 0; i < extendedKeyCount; i++) {
                    const key = extendedKeyArray[i];
                    if (additional.key) {
                        chunk.push({
                            data: key,
                            node: additional.key
                        });
                    }
                    if (additional.value) {
                        chunk.push({
                            data: data[key],
                            node: additional.value
                        });
                    }
                }
            }
        }
        return (null);
    }
};

const ArrayFormat = {
    type: "array",
    exceptions: {
        SHAPE_PROPERTY_REQUIRED: "The 'shape' property is required.",
        SHAPE_PROPERTY_MALFORMED: "The 'shape' property must be of type Array.",
        SHAPE_PROPERTY_ARRAY_ITEM_MALFORMED: "The array items of the 'shape' property must be of type Plain Object or Array.",
        ADDITIONAL_PROPERTY_MALFORMED: "The 'additional' property must be of type Boolean or a Plain Object.",
        ADDITIONAL__ITEM_PROPERTY_MALFORMED: "The 'additional.item' property, must be a criteria node Object.",
        ADDITIONAL__MIN_PROPERTY_MALFORMED: "The 'additional.min' property, must be of type Number.",
        ADDITIONAL__MAX_PROPERTY_MALFORMED: "The 'additional.max' property, must be of type Number.",
        ADDITIONAL__MIN_AND_MAX_PROPERTIES_MISCONFIGURED: "The 'additional.min' property cannot be greater than 'additional.max' property."
    },
    isShorthandShape(obj) {
        return (isArray(obj));
    },
    mount(chunk, criteria) {
        const { shape, additional } = criteria;
        if (!("shape" in criteria)) {
            return ("SHAPE_PROPERTY_REQUIRED");
        }
        if (!isArray(shape)) {
            return ("SHAPE_PROPERTY_MALFORMED");
        }
        for (const item of shape) {
            if (!isPlainObject(item) && !isArray(item)) {
                return ("SHAPE_PROPERTY_ARRAY_ITEM_MALFORMED");
            }
        }
        if (additional !== undefined) {
            if (isPlainObject(additional)) {
                const { item, min, max } = additional;
                if (item !== undefined && !isPlainObject(item)) {
                    return ("ADDITIONAL__ITEM_PROPERTY_MALFORMED");
                }
                if (min !== undefined && typeof min !== "number") {
                    return ("ADDITIONAL__MIN_PROPERTY_MALFORMED");
                }
                if (max !== undefined && typeof max !== "number") {
                    return ("ADDITIONAL__MAX_PROPERTY_MALFORMED");
                }
                if (min !== undefined && max !== undefined && min > max) {
                    return ("ADDITIONAL__MIN_AND_MAX_PROPERTIES_MISCONFIGURED");
                }
            }
            else if (typeof additional !== "boolean") {
                return ("ADDITIONAL_PROPERTY_MALFORMED");
            }
        }
        const resolvedExtensible = additional ?? false;
        Object.assign(criteria, {
            additional: resolvedExtensible
        });
        for (let i = 0; i < shape.length; i++) {
            let node = shape[i];
            if (this.isShorthandShape(node)) {
                node = {
                    type: "array",
                    shape: node
                };
                shape[i] = node;
            }
            chunk.push({
                node: node,
                partPath: {
                    explicit: ["shape", i],
                    implicit: ["&", i]
                }
            });
        }
        if (typeof resolvedExtensible === "object") {
            if (resolvedExtensible.item) {
                chunk.push({
                    node: resolvedExtensible.item,
                    partPath: {
                        explicit: ["additional", "item"]
                    }
                });
            }
        }
        return (null);
    },
    check(chunk, criteria, data) {
        if (!isArray(data)) {
            return ("TYPE_ARRAY_UNSATISFIED");
        }
        const { shape, additional } = criteria;
        const declaredLength = shape.length;
        const definedLength = data.length;
        if (definedLength < declaredLength) {
            return ("SHAPE_UNSATISFIED");
        }
        if (!additional && definedLength > declaredLength) {
            return ("ADDITIONAL_UNALLOWED");
        }
        for (let i = 0; i < declaredLength; i++) {
            chunk.push({
                data: data[i],
                node: shape[i]
            });
        }
        if (definedLength === declaredLength) {
            return (null);
        }
        if (typeof additional === "object") {
            const extendedItemCount = definedLength - declaredLength;
            const { min, max } = additional;
            if (min !== undefined && extendedItemCount < min) {
                return ("ADDITIONAL_MIN_UNSATISFIED");
            }
            if (max !== undefined && extendedItemCount > max) {
                return ("ADDITIONAL_MAX_UNSATISFIED");
            }
            if (extendedItemCount && additional.item) {
                for (let i = declaredLength; i < definedLength; i++) {
                    chunk.push({
                        data: data[i],
                        node: additional.item
                    });
                }
            }
        }
        return (null);
    }
};

const UnionFormat = {
    type: "union",
    exceptions: {
        UNION_PROPERTY_REQUIRED: "The 'union' property is required.",
        UNION_PROPERTY_MALFORMED: "The 'union' property must be of type Array.",
        UNION_PROPERTY_ARRAY_LENGTH_MISCONFIGURED: "The array length of the 'union' must be greater than 0.",
        UNION_PROPERTY_ARRAY_ITEM_MALFORMED: "The array items of the 'union' property must be of type Plain Object.",
    },
    mount(chunk, criteria) {
        if (!("union" in criteria)) {
            return ("UNION_PROPERTY_REQUIRED");
        }
        const union = criteria.union;
        const unionLength = union.length;
        if (!isArray(union)) {
            return ("UNION_PROPERTY_MALFORMED");
        }
        if (unionLength < 1) {
            return ("UNION_PROPERTY_ARRAY_LENGTH_MISCONFIGURED");
        }
        for (let i = 0; i < unionLength; i++) {
            const node = union[i];
            if (!isPlainObject(node) && !isArray(node)) {
                return ("UNION_PROPERTY_ARRAY_ITEM_MALFORMED");
            }
            chunk.push({
                node: node,
                partPath: {
                    explicit: ["union", i]
                }
            });
        }
        return (null);
    },
    check(chunk, criteria, data) {
        const union = criteria.union;
        const unionLength = union.length;
        let rejectCount = 0;
        const hooks = {
            onAccept() {
                return ({
                    action: "IGNORE",
                    target: "CHUNK"
                });
            },
            onReject() {
                if (++rejectCount === unionLength) {
                    return ({
                        action: "REJECT",
                        code: "UNION_UNSATISFIED"
                    });
                }
                return ({
                    action: "IGNORE",
                    target: "BRANCH"
                });
            }
        };
        for (let i = 0; i < unionLength; i++) {
            chunk.push({
                hooks,
                data,
                node: union[i]
            });
        }
        return (null);
    }
};

const formatNatives = [
    FunctionFormat,
    BooleanFormat,
    SymbolFormat,
    NumberFormat,
    StringFormat,
    SimpleFormat,
    ObjectFormat,
    ArrayFormat,
    UnionFormat
];

/**
 * The `Schema` class is used to define and validate data structures,
 * ensuring they conform to specified criteria.
 */
class Schema {
    initiate(criteria) {
        this.managers.formats.add(formatNatives);
        const clonedCriteria = cloner(criteria);
        this.mountedCriteria = mounter(this.managers, clonedCriteria);
    }
    constructor(criteria) {
        this.managers = {
            formats: new FormatsManager(),
            events: new EventsManager()
        };
        // Deferred initiation of criteria if not called directly,
        // as plugins (or custom extensions) may set up specific
        // rules and actions for the preparation of the criteria.
        if (new.target === Schema)
            this.initiate(criteria);
    }
    /**
     * Properties representing the root of the mounted criteria,
     * which can be used in other schemas.
     */
    get criteria() {
        if (!this.mountedCriteria) {
            throw new Issue("SCHEMA", "Criteria are not initialized.");
        }
        return (this.mountedCriteria);
    }
    /**
     * Validates the provided data against the schema.
     *
     * @param data - The data to be validated.
     *
     * @returns `true` if the value is **valid**, otherwise `false`.
     * This function acts as a **type guard**, ensuring that
     * the validated data conforms to `GuardedCriteria<T>`.
     */
    validate(data) {
        const rejection = checker(this.managers, this.criteria, data);
        return (!rejection);
    }
    /**
     * Evaluates the provided data against the schema.
     *
     * @param data - The data to be evaluated.
     */
    evaluate(data) {
        const rejection = checker(this.managers, this.criteria, data);
        if (rejection) {
            return ({
                rejection: new SchemaDataRejection({
                    code: rejection.code,
                    node: rejection.task.node,
                    nodePath: rejection.task.fullPath
                }),
                data: null
            });
        }
        return ({ rejection: null, data });
    }
}
/*
const function_variant_string = new Schema({
    type: "function",
    variant: "BASIC"
});
const xAsyncFunction = async function () {};
console.log(function_variant_string.validate(xAsyncFunction))*/
/*
function testf(): ("ASYNC" | "BASIC"  | undefined) {
    return ("" as ("ASYNC" | "BASIC" | undefined))
}

const test = new Schema({
    type: "string",
    literal: ["test"]
});

type Test = SchemaInfer<typeof test>;
*/
/*
const test = new Schema({
    type: "object",

    shape: {},
    expandable: true
});
console.log(test.evaluate(Array));

console.log(isObject(Array));*/
/*
const hslItem = new Schema({
    type: "object",
    shape: {
        h: { type: "number" },
        s: { type: "number" },
        l: { type: "number" }
    }
});

const test = new Schema({
    type: "array",
    shape: [],
    expandable: {
        max: 10,
        item: hslItem.criteria
    }
});

type Test = SchemaInfer<typeof test>;

console.log(test.evaluate([{ h: 10, s: 10, l: 20 }]));
*/
//type Debug = Test['additional']
/*
const union_object = new Schema({
    type: "union",
    union: [{
        type: "object",
        shape: {
            foo: { type: "string" },
            bar: {
                type: "object",
                shape: {
                    foo: {
                        foo: {
                            type: "object",
                            shape: {
                                foo: { type: "string" }
                            }
                        },
                        bar: { type: "string" }
                    }
                }
            }
        }
    }, {
        type: "object",
        shape: {
            foo: {
                type: "object",
                shape: {
                    foo: {
                        type: "object",
                        shape: {
                            foo: { type: "string" },
                            bar: {
                                type: "object",
                                shape: {
                                    foo: { type: "string" }
                                }
                            }
                        }
                    }
                }
            },
            bar: { type: "string" }
        }
    }]
});
*/

function SchemaFactory(plugin1, plugin2, plugin3) {
    return class extends Schema {
        constructor(criteria) {
            super(criteria);
            const assignPlugin = (plugin) => {
                const { formats, ...members } = plugin;
                for (const key in members) {
                    if (key in this)
                        throw new Issue("Schema Factory", `Conflictual keys: '${key}'`);
                }
                Object.assign(this, members);
                this.managers.formats.add(formats);
            };
            assignPlugin(plugin1.call(this, criteria));
            if (plugin2)
                assignPlugin(plugin2.call(this, criteria));
            if (plugin3)
                assignPlugin(plugin3.call(this, criteria));
            this.initiate(criteria);
        }
    };
}
/*
import type { SetableCriteriaTemplate, GuardedCriteria, Format } from "./formats";
import { SpecTypesTemplate, FlowTypesTemplate } from "./formats/types";

export interface MongoIdSetableCriteria extends SetableCriteriaTemplate<"mongoId"> {
    mongoParam: boolean;
}

export interface MongoIdSpecTypes extends SpecTypesTemplate<
    MongoIdSetableCriteria,
    {}
> {}

export interface MongoIdFlowTypes extends FlowTypesTemplate<
    {},
    string
> {}

declare module './formats/types' {
    interface FormatSpecTypes {
        mongoId: MongoIdSpecTypes;
    }
    interface FormatFlowTypes<T extends SetableCriteria> {
        mongoId: T extends MongoIdSetableCriteria ? MongoIdFlowTypes : never;
    }
}

const MongoIdFormat: Format<MongoIdSetableCriteria> = {
    type: "mongoId",
    defaultCriteria: {},
    mount(chunk, criteria) {
        
    },
    check(chunk, criteria, value) {
        return (null);
    },
}

function plugin_A<T extends SetableCriteria>(this: SchemaInstance<T>, definedCriteria: T) {
    return ({
        formats: [MongoIdFormat],
        mongo(data: GuardedCriteria<T>) {
            
        }
    } satisfies SchemaPlugin);
}

const SchemaA = SchemaFactory(plugin_A);

const InstanceA = new SchemaA({ type: "mongoId", mongoParam: true });
*/

export { Issue, Schema, SchemaDataRejection, SchemaFactory, SchemaNodeException, base16ToBase32, base16ToBase64, base32ToBase16, base64ToBase16, getInternalTag, helpers, isArray, isAscii, isAsyncFunction, isAsyncGeneratorFunction, isBase16, isBase32, isBase32Hex, isBase64, isBase64Url, isDataUrl, isDomain, isEmail, isFunction, isGeneratorFunction, isIp, isIpV4, isIpV6, isObject, isPlainObject, isTypedArray, isUuid, testers };
//# sourceMappingURL=index.js.map
