class Issue extends Error {
    constructor(context, message, plugin) {
        super(message);
        const red = "\x1b[31m", cyan = "\x1b[36m", gray = "\x1b[90m", reset = "\x1b[0m";
        const emitter = "Valia" + (plugin ? ":" + plugin : "");
        const timestamp = new Date().toISOString();
        this.message =
            `\n${red}[Error]${reset} ${cyan}[${emitter}]${reset} ${gray}${timestamp}${reset}` +
                `\nContext: ${context}` +
                `\nMessage: ${message}`;
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
    get(type) {
        const format = this.store.get(type);
        if (!format)
            throw new Issue("Formats Manager", "The format of type '" + type + "' is unknown.");
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

const nodeSymbol = Symbol('internal');
function hasNodeSymbol(obj) {
    return (typeof obj === "object" && Reflect.has(obj, nodeSymbol));
}
class MountingStack {
    constructor(rootNode) {
        this.tasks = [];
        this.tasks.push({
            node: rootNode,
            partPaths: { explicit: [], implicit: [] },
            fullPaths: { explicit: [], implicit: [] }
        });
    }
    pushChunk(sourceTask, chunk) {
        const { fullPaths } = sourceTask;
        for (let i = 0; i < chunk.length; i++) {
            const { node, partPaths } = chunk[i];
            this.tasks.push({
                node,
                partPaths,
                fullPaths: {
                    explicit: fullPaths.explicit.concat(partPaths.explicit),
                    implicit: fullPaths.implicit.concat(partPaths.implicit)
                }
            });
        }
    }
}
function mounter(managers, rootNode) {
    const { formats, events } = managers;
    const stack = new MountingStack(rootNode);
    while (stack.tasks.length) {
        const currentTask = stack.tasks.pop();
        const { node, partPaths, fullPaths } = currentTask;
        if (hasNodeSymbol(node)) {
            node[nodeSymbol] = {
                ...node[nodeSymbol],
                partPaths
            };
        }
        else {
            const format = formats.get(node.type);
            const chunk = [];
            format.mount?.(chunk, node);
            Object.assign(node, {
                ...format.defaultCriteria,
                ...node,
                [nodeSymbol]: {
                    childNodes: chunk.map((task) => task.node),
                    partPaths
                }
            });
            Object.freeze(node);
            if (chunk.length)
                stack.pushChunk(currentTask, chunk);
            events.emit("NODE_MOUNTED", node, fullPaths);
        }
    }
    events.emit("TREE_MOUNTED", rootNode);
    return rootNode;
}

function createReject(task, code) {
    return ({
        code,
        path: task.fullPaths,
        type: task.node.type,
        label: task.node.label,
        message: task.node.message
    });
}
class CheckingStack {
    constructor(rootNode, rootData) {
        this.tasks = [];
        this.tasks.push({
            data: rootData,
            node: rootNode,
            fullPaths: { explicit: [], implicit: [] }
        });
    }
    pushChunk(sourceTask, chunk) {
        for (let i = 0; i < chunk.length; i++) {
            const currentTask = chunk[i];
            const partPaths = currentTask.node[nodeSymbol].partPaths;
            let stackHooks = sourceTask.stackHooks;
            if (currentTask.hooks) {
                const hooks = {
                    owner: sourceTask,
                    index: {
                        chunk: this.tasks.length - i,
                        branch: this.tasks.length
                    },
                    ...currentTask.hooks
                };
                stackHooks = stackHooks ? stackHooks.concat(hooks) : [hooks];
            }
            this.tasks.push({
                data: currentTask.data,
                node: currentTask.node,
                fullPaths: {
                    explicit: sourceTask.fullPaths.explicit.concat(partPaths.explicit),
                    implicit: sourceTask.fullPaths.implicit.concat(partPaths.implicit)
                },
                stackHooks
            });
        }
    }
    playHooks(currentTask, reject) {
        const stackHooks = currentTask.stackHooks;
        if (!stackHooks)
            return (null);
        const lastHooks = stackHooks[stackHooks.length - 1];
        if (!reject && lastHooks.index.branch !== this.tasks.length) {
            return (null);
        }
        for (let i = stackHooks.length - 1; i >= 0; i--) {
            const hooks = stackHooks[i];
            const claim = reject ? hooks.onReject(reject) : hooks.onAccept();
            switch (claim.action) {
                case "DEFAULT":
                    this.tasks.length = hooks.index.branch;
                    if (!reject)
                        return (null);
                    continue;
                case "REJECT":
                    this.tasks.length = hooks.index.branch;
                    reject = createReject(hooks.owner, claim.code);
                    continue;
                case "IGNORE":
                    if (claim?.target === "CHUNK") {
                        this.tasks.length = hooks.index.chunk;
                    }
                    else {
                        this.tasks.length = hooks.index.branch;
                    }
                    return (null);
            }
        }
        return (reject);
    }
}
function checker(managers, rootNode, rootData) {
    const { formats, events } = managers;
    const stack = new CheckingStack(rootNode, rootData);
    let reject = null;
    while (stack.tasks.length) {
        const currentTask = stack.tasks.pop();
        const { data, node, stackHooks } = currentTask;
        const chunk = [];
        let code = null;
        if (!(node.nullish && data == null)) {
            const format = formats.get(node.type);
            code = format.check(chunk, node, data);
        }
        if (code)
            reject = createReject(currentTask, code);
        else if (chunk.length)
            stack.pushChunk(currentTask, chunk);
        if (stackHooks)
            reject = stack.playHooks(currentTask, reject);
        if (reject)
            break;
    }
    events.emit("DATA_CHECKED", rootNode, rootData, reject);
    return (reject);
}

/**
 * Check if all characters of the string are in the ASCII table (%d0-%d127).
 *
 * If you enable `onlyPrintable` valid characters will be limited to
 * printable characters from the ASCII table (%32-%d126).
 *
 * Empty returns `false`.
 */
function isAscii(str, params) {
    if (params?.onlyPrintable)
        return (RegExp("^[\\x20-\\x7E]+$").test(str));
    return (RegExp("^[\\x00-\\x7F]+$").test(str));
}

const extractUuidVersionRegex = new RegExp("^[0-9A-F]{8}-[0-9A-F]{4}-([1-7])[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$", "i");
/**
 * **Standard :** RFC 9562
 *
 * @see https://datatracker.ietf.org/doc/html/rfc9562#section-4
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

function lazy(callback) {
    let ref = null, val = null;
    // Test 'WeakRef' support
    if (typeof WeakRef !== "undefined") {
        ref = undefined;
    }
    return () => {
        if (ref !== null) {
            const temp = ref?.deref();
            if (!temp) {
                ref = new WeakRef(callback());
                return (ref.deref());
            }
            return (temp);
        }
        else if (val === null) {
            val = callback();
        }
        return (val);
    };
}

/**
 * Composition :
 * * "letter = %d65-%d90 / %d97-%d122" A-Z / a-z
 * * "digit = %x30-39" 0-9
 * * "label = letter [*(digit / letter / "-") digit / letter]"
 * * "domain = label *("." label)"
 */
const domainRegex = new RegExp("^[A-Za-z](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\\.[A-Za-z](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*$");
/**
 * **Standard :** RFC 1035
 *
 * @see https://datatracker.ietf.org/doc/html/rfc1035#section-2.3.1
 *
 * **Follows :**
 * `<domain>`
 *
 * @version 1.0.0-beta
 */
function isDomain(str, params) {
    return (domainRegex.test(str));
}

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
const ipV4Seg = "(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])";
const ipV4Pattern = `(?:${ipV4Seg}\\.){3}${ipV4Seg}`;
const ipV4SimpleRegex = new RegExp(`^${ipV4Pattern}$`);
const ipV4PrefixRegex = lazy(() => new RegExp(`^${ipV4Pattern}/(3[0-2]|[12]?[0-9])$`));
const ipV6Seg = "(?:[0-9a-fA-F]{1,4})";
const IPv6Pattern = "(?:" +
    `(?:${ipV6Seg}:){7}(?:${ipV6Seg}|:)|` +
    `(?:${ipV6Seg}:){6}(?:${ipV4Pattern}|:${ipV6Seg}|:)|` +
    `(?:${ipV6Seg}:){5}(?::${ipV4Pattern}|(?::${ipV6Seg}){1,2}|:)|` +
    `(?:${ipV6Seg}:){4}(?:(?::${ipV6Seg}){0,1}:${ipV4Pattern}|(?::${ipV6Seg}){1,3}|:)|` +
    `(?:${ipV6Seg}:){3}(?:(?::${ipV6Seg}){0,2}:${ipV4Pattern}|(?::${ipV6Seg}){1,4}|:)|` +
    `(?:${ipV6Seg}:){2}(?:(?::${ipV6Seg}){0,3}:${ipV4Pattern}|(?::${ipV6Seg}){1,5}|:)|` +
    `(?:${ipV6Seg}:){1}(?:(?::${ipV6Seg}){0,4}:${ipV4Pattern}|(?::${ipV6Seg}){1,6}|:)|` +
    `(?::(?:(?::${ipV6Seg}){0,5}:${ipV4Pattern}|(?::${ipV6Seg}){1,7}|:)))`;
const ipV6SimpleRegex = new RegExp(`^${IPv6Pattern}$`);
const ipV6PrefixRegex = lazy(() => new RegExp(`^${IPv6Pattern}/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$`));
/**
 * **Standard:** No standard
 *
 * @version 1.0.0
 */
function isIp(str, params) {
    if (!params?.prefix && ipV4SimpleRegex.test(str))
        return (true);
    else if (params?.prefix && ipV4PrefixRegex().test(str))
        return (true);
    if (!params?.prefix && ipV6SimpleRegex.test(str))
        return (true);
    else if (params?.prefix && ipV6PrefixRegex().test(str))
        return (true);
    return (false);
}
/**
 * **Standard:** No standard
 *
 * @version 1.0.0
 */
function isIpV4(str, params) {
    if (!params?.prefix && ipV4SimpleRegex.test(str))
        return (true);
    else if (params?.prefix && ipV4PrefixRegex().test(str))
        return (true);
    return (false);
}
/**
 * **Standard:** No standard
 *
 * @version 1.0.0
 */
function isIpV6(str, params) {
    if (!params?.prefix && ipV4SimpleRegex.test(str))
        return (true);
    else if (params?.prefix && ipV4PrefixRegex().test(str))
        return (true);
    return (false);
}

const dotStringPattern = "(?:[-!=?A-B\\x23-\\x27\\x2A-\\x2B\\x2F-\\x39\\x5E-\\x7E]+(?:\\.[-!=?A-B\\x23-\\x27\\x2A-\\x2B\\x2F-\\x39\\x5E-\\x7E]+)*)";
const quotedStringPattern = "(?:\"(?:[\\x20-\\x21\\x23-\\x5B\\x5D-\\x7E]|\\\\[\\x20-\\x7E])*\")";
const localPartSimpleRegex = new RegExp(`^${dotStringPattern}$`);
const localPartQuotedRegex = lazy(() => new RegExp(`^(?:${dotStringPattern}|${quotedStringPattern})$`));
const domainPartAddrLiteralRegex = lazy(() => new RegExp(`^\\[(?:IPv6:${IPv6Pattern}|${ipV4Pattern})\\]$`));
const domainPartGeneralAddrLiteralRegex = lazy(() => new RegExp(`(?:[a-zA-Z0-9-]*[a-zA-Z0-9]+:[\\x21-\\x5A\\x5E-\\x7E]+)`));
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
    else if (params?.allowQuotedString && localPartQuotedRegex().test(str)) {
        return (true);
    }
    return (false);
}
function isValidDomainPart(str, params) {
    if (isDomain(str))
        return (true);
    if (params?.allowAddressLiteral
        && domainPartAddrLiteralRegex().test(str))
        return (true);
    if (params?.allowGeneralAddressLiteral
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

/** @see https://datatracker.ietf.org/doc/html/rfc6838#section-4.2 */
const ianaTokenPattern = "(?:[a-zA-Z0-9](?:[+]?[a-zA-Z0-9!#$&^_-][.]?){0,126})";
const discreteTypePattern = "(?:text|image|application|audio|video|message|multipart)";
const parameterPattern = "[-!*+.0-9A-Z\\x23-\\x27\\x5E-\\x7E]+=(?:[-!*+.0-9A-Z\\x23-\\x27\\x5E-\\x7E]+|\"(?:[^\\\"\\x13]|\\\\[\\x00-\\x7F])+\")";
const mediatypePattern = `${discreteTypePattern}\\/${ianaTokenPattern}(?:;${parameterPattern})*`;
const contentPattern = "(?:[a-zA-Z0-9-;/?:@&=+$,_.!~*'()]|%[a-zA-Z0-9]{2})*";
const dataUrlRegex = lazy(() => new RegExp(`^data:(?:${mediatypePattern})?(?:;base64)?,${contentPattern}$`));
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
    if (params?.type || params?.subtype) {
        const [_, type, subtype] = new RegExp("^data:(.*?)\/(.*?)[;|,]").exec(str);
        if (params?.type && params.type !== type)
            return (false);
        if (params?.subtype && !params?.subtype.includes(subtype))
            return (false);
    }
    return (true);
}

const base16Regex = new RegExp("^(?:[A-F0-9]{2})*$");
const base32Regex = new RegExp("^(?:[A-Z2-7]{8})*(?:[A-Z2-7]{2}[=]{6}|[A-Z2-7]{4}[=]{4}|[A-Z2-7]{5}[=]{3}|[A-Z2-7]{6}[=]{2}|[A-Z2-7]{7}[=]{1})?$");
const base32HexRegex = lazy(() => new RegExp("^(?:[0-9A-V]{8})*(?:[0-9A-V]{2}[=]{6}|[0-9A-V]{4}[=]{4}|[0-9A-V]{5}[=]{3}|[0-9A-V]{6}[=]{2}|[0-9A-V]{7}[=]{1})?$"));
const base64Regex = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}[=]{2}|[A-Za-z0-9+/]{3}[=]{1})?$");
const base64UrlRegex = lazy(() => new RegExp("^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2}[=]{2}|[A-Za-z0-9_-]{3}[=]{1})?$"));
/**
 * **Standard :** RFC 4648
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-4
 *
 * @version 1.0.0
 */
function isBase64(str, params) {
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
function isBase64Url(str, params) {
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
function isBase32(str, params) {
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
function isBase32Hex(str, params) {
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
function isBase16(str, params) {
    if (typeof str !== "string")
        new Issue("Parameters", "'str' must be of type string.");
    return (str.length % 2 === 0 && base16Regex.test(str));
}

var stringTesters = /*#__PURE__*/Object.freeze({
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

function hasTag(target, tag) {
    return (Object.prototype.toString.call(target).slice(8, -1) === tag);
}

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

// OBJECT
function isObject(x) {
    return (typeof x === "object");
}
/**
 * A plain object is considered as follows:
 * - It must be an object.
 * - It must have a prototype of `Object.prototype` or `null`.
*/
function isPlainObject(x) {
    if (x === null || typeof x !== "object")
        return (false);
    const prototype = Object.getPrototypeOf(x);
    if (prototype !== Object.prototype && prototype !== null) {
        return (false);
    }
    return (true);
}
// ARRAY
function isArray(x) {
    return (Array.isArray(x));
}
// FUNCTION
function isFunction(x) {
    return (typeof x === "function");
}
function isBasicFunction(x) {
    return (hasTag(x, "Function"));
}
function isAsyncFunction(x) {
    return (hasTag(x, "AsyncFunction"));
}
function isGeneratorFunction(x) {
    return (hasTag(x, "GeneratorFunction"));
}
function isAsyncGeneratorFunction(x) {
    return (hasTag(x, "AsyncGeneratorFunction"));
}

const testers = {
    string: stringTesters
};

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

const BooleanFormat = {
    type: "boolean",
    defaultCriteria: {},
    check(chunk, criteria, data) {
        if (typeof data !== "boolean") {
            return ("TYPE_BOOLEAN_REQUIRED");
        }
        return (null);
    },
};

const SymbolFormat = {
    type: "symbol",
    defaultCriteria: {},
    check(chunk, criteria, data) {
        if (typeof data !== "symbol") {
            return "TYPE_SYMBOL_REQUIRED";
        }
        else if (criteria.symbol && data !== criteria.symbol) {
            return "DATA_SYMBOL_MISMATCH";
        }
        return (null);
    }
};

const NumberFormat = {
    type: "number",
    defaultCriteria: {},
    check(chunk, criteria, value) {
        if (typeof value !== "number") {
            return ("TYPE_NUMBER_REQUIRED");
        }
        else if (criteria.min != null && value < criteria.min) {
            return ("DATA_INFERIOR_MIN");
        }
        else if (criteria.max != null && value > criteria.max) {
            return ("DATA_SUPERIOR_MAX");
        }
        else if (criteria.enum != null) {
            if (isPlainObject(criteria.enum) && !Object.values(criteria.enum).includes(value)) {
                return ("DATA_ENUM_MISMATCH");
            }
            else if (isArray(criteria.enum) && !criteria.enum.includes(value)) {
                return ("DATA_ENUM_MISMATCH");
            }
        }
        else if (criteria.custom && !criteria.custom(value)) {
            return ("TEST_CUSTOM_FAILED");
        }
        return (null);
    }
};

const StringFormat = {
    type: "string",
    defaultCriteria: {
        empty: true
    },
    check(chunk, criteria, data) {
        if (typeof data !== "string") {
            return ("TYPE_STRING_REQUIRED");
        }
        const dataLength = data.length;
        if (!dataLength) {
            return (criteria.empty ? null : "DATA_EMPTY");
        }
        else if (criteria.min != null && dataLength < criteria.min) {
            return ("DATA_LENGTH_INFERIOR_MIN");
        }
        else if (criteria.max != null && dataLength > criteria.max) {
            return ("DATA_LENGTH_SUPERIOR_MAX");
        }
        else if (criteria.enum != null) {
            if (isArray(criteria.enum) && !criteria.enum.includes(data)) {
                return ("DATA_ENUM_MISMATCH");
            }
            else if (isPlainObject(criteria.enum) && !Object.values(criteria.enum).includes(data)) {
                return ("DATA_ENUM_MISMATCH");
            }
        }
        else if (criteria.regex != null && !criteria.regex.test(data)) {
            return ("TEST_REGEX_FAILED");
        }
        else if (criteria.tester && !testers.string[criteria.tester.name](data, criteria.tester?.params)) {
            return ("TEST_TESTER_FAILED");
        }
        else if (criteria.custom && !criteria.custom(data)) {
            return ("TEST_CUSTOM_FAILED");
        }
        return (null);
    }
};

const SimpleFormat = {
    type: "simple",
    defaultCriteria: {},
    bitflags: {
        undefined: 1 << 0,
        nullish: 1 << 1,
        null: 1 << 2,
        unknown: 1 << 3,
        any: 1 << 4
    },
    mount(chunk, criteria) {
        Object.assign(criteria, {
            bitcode: this.bitflags[criteria.simple]
        });
    },
    check(chunk, criteria, value) {
        const { bitflags } = this, { bitcode } = criteria;
        if (bitcode & (bitflags.any | bitflags.unknown)) {
            return (null);
        }
        if (bitcode & bitflags.nullish && value != null) {
            return ("TYPE_NULLISH_REQUIRED");
        }
        else if (bitcode & bitflags.null && value !== null) {
            return ("TYPE_NULL_REQUIRED");
        }
        else if ((bitcode & bitflags.undefined) && value !== undefined) {
            return ("TYPE_UNDEFINED_REQUIRED");
        }
        return (null);
    }
};

const RecordFormat = {
    type: "record",
    defaultCriteria: {
        empty: true
    },
    mount(chunk, criteria) {
        chunk.push({
            node: criteria.key,
            partPaths: {
                explicit: ["key"],
                implicit: []
            }
        });
        chunk.push({
            node: criteria.value,
            partPaths: {
                explicit: ["value"],
                implicit: ["%", "string", "symbol"]
            }
        });
    },
    check(chunk, criteria, data) {
        if (!isPlainObject(data)) {
            return ("TYPE_PLAIN_OBJECT_REQUIRED");
        }
        const keys = Reflect.ownKeys(data);
        const keysLength = keys.length;
        if (keysLength === 0) {
            return (criteria.empty ? null : "DATA_EMPTY_DISALLOWED");
        }
        else if (criteria.min != null && keysLength < criteria.min) {
            return ("DATA_SIZE_INFERIOR_MIN");
        }
        else if (criteria.max != null && keysLength > criteria.max) {
            return ("DATA_SIZE_SUPERIOR_MAX");
        }
        for (let i = 0; i < keysLength; i++) {
            const key = keys[i];
            chunk.push({
                data: key,
                node: criteria.key
            }, {
                data: data[key],
                node: criteria.value
            });
        }
        return (null);
    }
};

function isShorthandStruct(obj) {
    return (isPlainObject(obj) && typeof obj?.type !== "string");
}
const StructFormat = {
    type: "struct",
    defaultCriteria: {},
    mount(chunk, criteria) {
        const optionalKeys = criteria.optional;
        const acceptedKeys = Reflect.ownKeys(criteria.struct);
        const requiredKeys = acceptedKeys.filter(key => !optionalKeys?.includes(key));
        Object.assign(criteria, {
            acceptedKeys: new Set(acceptedKeys),
            requiredKeys: new Set(requiredKeys)
        });
        for (let i = 0; i < acceptedKeys.length; i++) {
            const key = acceptedKeys[i];
            if (isShorthandStruct(criteria.struct[key])) {
                criteria.struct[key] = {
                    type: "struct",
                    struct: criteria.struct[key]
                };
            }
            chunk.push({
                node: criteria.struct[key],
                partPaths: {
                    explicit: ["struct", key],
                    implicit: ["&", key]
                }
            });
        }
    },
    check(chunk, criteria, data) {
        if (!isPlainObject(data)) {
            return ("TYPE_PLAIN_OBJECT_REQUIRED");
        }
        const { acceptedKeys, requiredKeys } = criteria;
        const keys = Reflect.ownKeys(data);
        if (keys.length < requiredKeys.size) {
            return ("DATA_KEYS_MISSING");
        }
        let requiredLeft = requiredKeys.size;
        for (let i = keys.length - 1; i >= 0; i--) {
            const key = keys[i];
            if (!acceptedKeys.has(key)) {
                return ("DATA_KEYS_INVALID");
            }
            if (requiredKeys.has(key)) {
                requiredLeft--;
            }
            else if (requiredLeft > i) {
                return ("DATA_KEYS_MISSING");
            }
            chunk.push({
                data: data[key],
                node: criteria.struct[key]
            });
        }
        return (null);
    }
};

const ArrayFormat = {
    type: "array",
    defaultCriteria: {
        empty: true
    },
    mount(chunk, criteria) {
        chunk.push({
            node: criteria.item,
            partPaths: {
                explicit: ["item"],
                implicit: ["%", "number"],
            }
        });
    },
    check(chunk, criteria, data) {
        if (!isArray(data)) {
            return ("TYPE_ARRAY_REQUIRED");
        }
        const dataLength = data.length;
        if (!dataLength) {
            return (criteria.empty ? null : "DATA_EMPTY_DISALLOWED");
        }
        else if (criteria.min != null && dataLength < criteria.min) {
            return ("DATA_LENGTH_INFERIOR_MIN");
        }
        else if (criteria.max != null && dataLength > criteria.max) {
            return ("DATA_LENGTH_SUPERIOR_MAX");
        }
        for (let i = 0; i < dataLength; i++) {
            chunk.push({
                data: data[i],
                node: criteria.item
            });
        }
        return (null);
    }
};

const TupleFormat = {
    type: "tuple",
    defaultCriteria: {
        empty: false
    },
    mount(chunk, criteria) {
        for (let i = 0; i < criteria.tuple.length; i++) {
            chunk.push({
                node: criteria.tuple[i],
                partPaths: {
                    explicit: ["tuple", i],
                    implicit: ["&", i]
                }
            });
        }
    },
    check(chunk, criteria, data) {
        if (!isArray(data)) {
            return ("TYPE_ARRAY_REQUIRED");
        }
        const dataLength = data.length;
        if (dataLength < criteria.tuple.length) {
            return ("DATA_LENGTH_INFERIOR_MIN");
        }
        else if (dataLength > criteria.tuple.length) {
            return ("DATA_LENGTH_SUPERIOR_MAX");
        }
        for (let i = 0; i < dataLength; i++) {
            chunk.push({
                data: data[i],
                node: criteria.tuple[i]
            });
        }
        return (null);
    }
};

const UnionFormat = {
    type: "union",
    defaultCriteria: {},
    mount(chunk, criteria) {
        const unionLength = criteria.union.length;
        for (let i = 0; i < unionLength; i++) {
            chunk.push({
                node: criteria.union[i],
                partPaths: {
                    explicit: ["union", i],
                    implicit: []
                }
            });
        }
    },
    check(chunk, criteria, data) {
        const unionLength = criteria.union.length;
        const total = {
            hooked: unionLength,
            rejected: 0
        };
        const hooks = {
            onAccept() {
                return ({
                    action: "IGNORE",
                    target: "CHUNK"
                });
            },
            onReject() {
                total.rejected++;
                if (total.rejected === total.hooked) {
                    return ({
                        action: "REJECT",
                        code: "DATA_UNION_MISMATCH"
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
                node: criteria.union[i]
            });
        }
        return (null);
    }
};

/*
export const formatNatives = {
    boolean: BooleanFormat,
    symbol: SymbolFormat,
    number: NumberFormat,
    string: StringFormat,
    simple: SimpleFormat,
    record: RecordFormat,
    struct: StructFormat,
    array: ArrayFormat,
    tuple: TupleFormat,
    union: UnionFormat
} satisfies Record<string, Format<SetableCriteria>>;
*/
const formatNatives = [
    BooleanFormat,
    SymbolFormat,
    NumberFormat,
    StringFormat,
    SimpleFormat,
    RecordFormat,
    StructFormat,
    ArrayFormat,
    TupleFormat,
    UnionFormat
];

/**
 * The `Schema` class is used to define and validate data structures,
 * ensuring they conform to specified criteria.
 */
class Schema {
    initiate(definedCriteria) {
        this.managers.formats.add(formatNatives);
        const clonedCriteria = cloner(definedCriteria);
        this._criteria = mounter(this.managers, clonedCriteria);
    }
    constructor(criteria) {
        this.managers = {
            formats: new FormatsManager(),
            events: new EventsManager()
        };
        // Deferred initiation of criteria if not called directly,
        // as plugins (or custom extensions) may set up specific
        // rules and actions for the preparation of the criteria.
        if (new.target === Schema) {
            this.initiate(criteria);
        }
    }
    /**
     * Properties representing the root of the mounted criteria,
     * which can be used in other schemas.
     */
    get criteria() {
        if (!this._criteria) {
            throw new Issue("Schema", "Criteria are not initialized.");
        }
        return (this._criteria);
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
        const reject = checker(this.managers, this.criteria, data);
        return (!reject);
    }
    /**
     * Evaluates the provided data against the schema.
     *
     * @param data - The data to be evaluated.
     *
     * @returns An object containing:
     * - `{ reject: CheckingReject, value: null }` if the data is **rejected**.
     * - `{ reject: null, value: GuardedCriteria<T> }` if the data is **accepted**.
     */
    evaluate(data) {
        const reject = checker(this.managers, this.criteria, data);
        if (reject)
            return ({ reject });
        return ({ data: data });
    }
}

function SchemaComposer(plugin1, plugin2, plugin3) {
    return class SchemaComposed extends Schema {
        constructor(criteria) {
            super(criteria);
            const mixinPlugin = (plugin) => {
                const { formats, ...members } = plugin;
                for (const key in members) {
                    if (key in this)
                        throw new Issue("Schema Composer", `Conflictual keys: '${key}'`);
                }
                this.managers.formats.add(formats);
                Object.assign(this, members);
            };
            mixinPlugin(plugin1.call(this, criteria));
            if (plugin2)
                mixinPlugin(plugin2.call(this, criteria));
            if (plugin3)
                mixinPlugin(plugin3.call(this, criteria));
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

export interface MariaIdSetableCriteria extends SetableCriteriaTemplate<"mariaId"> {
    mariaParam: boolean;
}

export interface MariaIdSpecTypes extends SpecTypesTemplate<
    MariaIdSetableCriteria,
    {}
> {}

export interface MariaIdFlowTypes extends FlowTypesTemplate<
    {},
    number
> {}

declare module './formats/types' {
    interface FormatSpecTypes {
        mongoId: MongoIdSpecTypes;
        mariaId: MariaIdSpecTypes;
    }
    interface FormatFlowTypes<T extends SetableCriteria> {
        mongoId: T extends MongoIdSetableCriteria ? MongoIdFlowTypes : never;
        mariaId: T extends MariaIdSetableCriteria ? MariaIdFlowTypes : never;
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

const MariaIdFormat: Format<MariaIdSetableCriteria> = {
    type: "mariaId",
    defaultCriteria: {},
    mount(chunk, criteria) {
        
    },
    check(chunk, criteria, value) {
        return (null);
    },
}

function plugin_A<T extends SetableCriteria>(definedCriteria: T) {
    return ({
        formats: [MongoIdFormat],
        foo(data: GuardedCriteria<T>) {
            
        },
        bar(data: GuardedCriteria<T>) {
        
        }
    } satisfies PluginRequirement);
}

function plugin_B<T extends SetableCriteria>(this: SchemaInstance<T>, criteria: T) {
    const context = this;

    return ({
        formats: [MariaIdFormat],
        plugin_B_1(data: GuardedCriteria<T>) {
            return (context.criteria)
        }
    } satisfies PluginRequirement);
}

const Tessss = SchemaComposer(plugin_A, plugin_B);//, plugin_B//, plugin_B

const t1cccccc = new Tessss({ type: "mongoId", mongoParam: true });

const t2cccccc = new Tessss({ type: "struct", struct: { test: { type: "string" }} });

t2cccccc.plugin_B_1({ test: ""})*/

export { EventsManager, FormatsManager, Issue, Schema, SchemaComposer, base16ToBase32, base16ToBase64, base32ToBase16, base64ToBase16, isArray, isAscii, isAsyncFunction, isAsyncGeneratorFunction, isBase16, isBase32, isBase32Hex, isBase64, isBase64Url, isBasicFunction, isDataUrl, isDomain, isEmail, isFunction, isGeneratorFunction, isIp, isIpV4, isIpV6, isObject, isPlainObject, isUuid };
//# sourceMappingURL=index.js.map
