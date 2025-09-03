class SchemaException extends Error {
    constructor(message) {
        super(message);
        this.name = "SchemaException";
    }
}
class SchemaNodeException extends Error {
    constructor(code, message, node, nodePath) {
        super(message);
        this.name = "SchemaNodeException";
        this.code = code;
        this.node = node;
        this.nodePath = nodePath;
    }
}
class SchemaDataRejection {
    constructor(rootData, rootNode, code, data, node, nodePath) {
        this.rootData = rootData;
        this.rootNode = rootNode;
        this.rootLabel = rootNode.label;
        this.code = code;
        this.data = data;
        this.node = node;
        this.nodePath = nodePath;
        this.label = node.label;
        if (typeof node.message === "function") {
            this.message = node.message(code, data, node, nodePath);
        }
        else {
            this.message = node.message;
        }
    }
}
class SchemaDataAdmission {
    constructor(data, node) {
        this.data = data;
        this.node = node;
        this.label = node.label;
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
        return this.store.has(type);
    }
    get(type) {
        const format = this.store.get(type);
        if (!format)
            throw new SchemaException("The format is unknown : " + type);
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

const nodeSymbol = Symbol("node");
const commonExceptions = {
    TYPE_PROPERTY_UNDEFINED: "",
    TYPE_PROPERTY_MISDECLARED: "",
    TYPE_PROPERTY_MISCONFIGURED: "",
    LABEL_PROPERTY_MISDECLARED: "",
    MESSAGE_PROPERTY_MISDECLARED: ""
};
function commonMount(managers, node) {
    const { type, label, message } = node;
    if (!("type" in node)) {
        return ("TYPE_PROPERTY_UNDEFINED");
    }
    if (typeof type !== "string") {
        return ("TYPE_PROPERTY_MISDECLARED");
    }
    if (!managers.formats.has(type)) {
        return ("TYPE_PROPERTY_MISCONFIGURED");
    }
    if (label !== undefined && typeof label !== "string") {
        return ("LABEL_PROPERTY_MISDECLARED");
    }
    if (message !== undefined
        && typeof message !== "string"
        && typeof message !== "function") {
        return ("MESSAGE_PROPERTY_MISDECLARED");
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
            nodePath: { explicit: [], implicit: [] }
        });
    }
    pushChunk(sourceTask, chunk) {
        const prevNodePath = sourceTask.nodePath;
        for (let i = 0; i < chunk.length; i++) {
            const { node, partPath } = chunk[i];
            this.tasks.push({
                node,
                partPath,
                nodePath: {
                    explicit: partPath.explicit
                        ? prevNodePath.explicit.concat(partPath.explicit)
                        : prevNodePath.explicit,
                    implicit: partPath.implicit
                        ? prevNodePath.implicit.concat(partPath.implicit)
                        : prevNodePath.implicit
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
        const { node, nodePath, partPath } = currentTask;
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
                const message = commonExceptions[code];
                throw new SchemaNodeException(code, message, node, nodePath);
            }
            const format = formats.get(node.type);
            const chunkTasks = [];
            code = format.mount(chunkTasks, node);
            if (code) {
                const message = format.exceptions[code];
                throw new SchemaNodeException(code, message, node, nodePath);
            }
            Object.assign(node, {
                [nodeSymbol]: {
                    partPath,
                    childNodes: chunkTasks.map((task) => task.node)
                }
            });
            Object.freeze(node);
            if (chunkTasks.length) {
                stack.pushChunk(currentTask, chunkTasks);
            }
            events.emit("NODE_MOUNTED", node, nodePath);
        }
    }
    events.emit("TREE_MOUNTED", rootNode);
    return rootNode;
}

class CheckerStack {
    constructor(rootNode, rootData) {
        this.tasks = [];
        this.hooks = [];
        this.tasks.push({
            data: rootData,
            node: rootNode,
            nodePath: { explicit: [], implicit: [] },
            closerHook: null
        });
    }
    pushChunk(sourceTask, chunk) {
        const prevCloserHook = sourceTask.closerHook;
        const prevNodePath = sourceTask.nodePath;
        const staskTaskLength = this.tasks.length;
        const stackHookLength = this.hooks.length;
        const chunkTaskLength = chunk.length;
        let chunkTaskIndex = 0, chunkHookCount = 0;
        while (chunkTaskIndex < chunkTaskLength) {
            const { data, node, hook } = chunk[chunkTaskIndex];
            const partPath = node[nodeSymbol].partPath;
            let closerHook = prevCloserHook;
            if (hook) {
                closerHook = {
                    ...hook,
                    sourceTask,
                    chunkTaskIndex: staskTaskLength,
                    branchTaskIndex: staskTaskLength + chunkTaskIndex,
                    chunkHookIndex: stackHookLength,
                    branchHookIndex: stackHookLength + chunkHookCount
                };
                this.hooks.push(closerHook);
                chunkHookCount++;
            }
            this.tasks.push({
                data,
                node,
                nodePath: {
                    explicit: partPath.explicit
                        ? prevNodePath.explicit.concat(partPath.explicit)
                        : prevNodePath.explicit,
                    implicit: partPath.implicit
                        ? prevNodePath.implicit.concat(partPath.implicit)
                        : prevNodePath.implicit
                },
                closerHook
            });
            chunkTaskIndex++;
        }
    }
    playHooks(closerHook, rejection) {
        if (!rejection && closerHook.branchTaskIndex !== this.tasks.length) {
            return (null);
        }
        let currentHook = closerHook;
        while (currentHook) {
            const result = rejection
                ? currentHook.onReject(rejection)
                : currentHook.onAccept();
            switch (result.action) {
                case "REJECT":
                    this.tasks.length = currentHook.branchTaskIndex;
                    this.hooks.length = currentHook.branchHookIndex;
                    rejection = {
                        issuerTask: currentHook.sourceTask,
                        code: result.code
                    };
                    break;
                case "CANCEL":
                    if (result.target === "CHUNK") {
                        this.tasks.length = currentHook.chunkTaskIndex;
                        this.hooks.length = currentHook.chunkHookIndex;
                    }
                    else if (result.target === "BRANCH") {
                        this.tasks.length = currentHook.branchTaskIndex;
                        this.hooks.length = currentHook.branchHookIndex;
                    }
                    return (null);
            }
            if (rejection || currentHook.chunkHookIndex === 0)
                break;
            currentHook = this.hooks[currentHook.chunkHookIndex];
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
        const { data, node, closerHook } = currentTask;
        const format = formats.get(node.type);
        const chunkTasks = [];
        const code = format.check(chunkTasks, node, data);
        if (chunkTasks.length) {
            stack.pushChunk(currentTask, chunkTasks);
        }
        if (code) {
            rejection = { issuerTask: currentTask, code };
        }
        if (closerHook) {
            rejection = stack.playHooks(closerHook, rejection);
        }
        if (rejection)
            break;
    }
    if (rejection) {
        const rejectionInstance = new SchemaDataRejection(rootData, rootNode, rejection.code, rejection.issuerTask.data, rejection.issuerTask.node, rejection.issuerTask.nodePath);
        events.emit("DATA_REJECTED", rejectionInstance);
        return ({
            success: false,
            rejection: rejectionInstance,
            admission: null
        });
    }
    const admissionInstance = new SchemaDataAdmission(rootData, rootNode);
    events.emit("DATA_ADMITTED", admissionInstance);
    return ({
        success: true,
        rejection: null,
        admission: admissionInstance
    });
}

function getInternalTag(target) {
    return (Object.prototype.toString.call(target).slice(8, -1));
}

var objectHelpers = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getInternalTag: getInternalTag
});

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
const base32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const base32Hex = "0123456789ABCDEFGHIJKLMNOPQRSTUV";
const base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const base64Url = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
function base16ToBase32(str, to = "B32", padding = true) {
    if (typeof str !== "string") {
        throw new Error("The 'str' argument must be of type string.");
    }
    if (typeof to !== "string") {
        throw new Error("The 'to' argument must be of type string.");
    }
    if (typeof padding !== "boolean") {
        throw new Error("The 'string' argument must be of type boolean.");
    }
    if (to === "B32")
        return (convertBase16ToBase32(str, base32, padding));
    if (to === "B32HEX")
        return (convertBase16ToBase32(str, base32Hex, padding));
    throw new Error("The 'to' argument must be a known string.");
}
function base16ToBase64(str, to = "B64", padding = true) {
    if (typeof str !== "string") {
        throw new Error("The 'str' argument must be of type string.");
    }
    if (typeof to !== "string") {
        throw new Error("The 'to' argument must be of type string.");
    }
    if (typeof padding !== "boolean") {
        throw new Error("The 'string' argument must be of type boolean.");
    }
    if (to === "B64")
        return (convertBase16ToBase64(str, base64, padding));
    if (to === "B64URL")
        return (convertBase16ToBase64(str, base64Url, padding));
    throw new Error("The 'to' argument must be a known string.");
}
function base32ToBase16(str, from = "B32") {
    if (typeof str !== "string") {
        throw new Error("The 'str' argument must be of type string.");
    }
    if (typeof from !== "string") {
        throw new Error("The 'to' argument must be of type string.");
    }
    if (from === "B32")
        return (convertBase32ToBase16(str, base32));
    if (from === "B32HEX")
        return (convertBase32ToBase16(str, base32Hex));
    throw new Error("The 'from' argument must be a known string.");
}
function base64ToBase16(str, from = "B64") {
    if (typeof str !== "string") {
        throw new Error("The 'str' argument must be of type string.");
    }
    if (typeof from !== "string") {
        throw new Error("The 'to' argument must be of type string.");
    }
    if (from === "B64")
        return (convertBase64ToBase16(str, base64));
    if (from === "B64URL")
        return (convertBase64ToBase16(str, base64Url));
    throw new Error("The 'from' argument must be a known string.");
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
 * Check if all characters in the string are part of the ASCII table.
 *
 * An empty string will return `false`.
 */
function isAscii(str, options) {
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
function isUuid(str, options) {
    if (typeof str !== "string") {
        throw new Error("The 'str' argument must be of type string.");
    }
    if (options !== undefined) {
        if (typeof options !== "object") {
            throw new Error("The 'options' argument must be of type object.");
        }
        if (options?.version !== undefined) {
            if (typeof options.version !== "number") {
                throw new Error("The 'cidr' property of the 'options' argument must be of type number.");
            }
            if (options.version < 1 || options.version > 7) {
                throw new Error("The 'cidr' property of the 'options' argument must be a number between 1 and 7.");
            }
        }
    }
    const execResult = extractUuidVersionRegex.exec(str);
    if (!execResult || !execResult[1])
        return (false);
    if (!options?.version || (execResult[1].codePointAt(0) - 48) === options?.version)
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
 * @see https://www.garykessler.net/library/file_sigs.html
 * @see https://en.wikipedia.org/wiki/List_of_file_signatures
 *
const signatures = [
    // Image
    { ext: "png" as const, offset: 0, flags: ["89504E470D0A1A0A"]},
    { ext: "jpg" as const, offset: 0, flags: ["FFD8FFE0"]},
    { ext: "jp2" as const, offset: 0, flags: ["0000000C6A5020200D0A870A"]},
    { ext: "gif" as const, offset: 0, flags: ["474946383761", "474946383961"]},
    { ext: "webp" as const, offset: 0, flags: ["52494646????????57454250"]},
    // Audio
    { ext: "mp3" as const, offset: 0, flags: ["FFFB", "FFF3", "FFF2", "494433"]},
    { ext: "mp4" as const, offset: 4, flags: ["6674797069736F6D", "667479704D534E56"]},
    // 3D
    { ext: "stl" as const, offset: 4, flags: ["736F6C6964"]}
];

export function hasFileSignature(hex: string, extensions: Array<(typeof signatures)[number]['ext']>) {
    for (let i = 0; i < extensions.length; i++) {
        const { offset, flags } = signatures.find(({ ext }) => ext === extensions[i])!;

        for (let i = 0; i < flags.length; i++) {
            const flag = flags[i];
            let j = (flag.length - 1) + offset;

            if (j >= hex.length) continue;
            while (j >= 0) {
                if (flag[j] !== "?" && hex[j] !== flag[j]) break;
                j--;
            }
            if (j === 0) return (true);
        }
    }
}*/

/**
# IPV4

Composition :
    dec-octet = 1*3DIGIT ; Representing a decimal integer value in the range 0 through 255
    suffixe    = 1*2DIGIT ; Representing a decimal integer value in the range 0 through 32.
    IPv4      = dec-octet 3("." dec-octet) ["/" suffixe]

# IPV6

Composition :
    HEXDIG      = DIGIT / A-F / a-f
    IPv6-full   = 1*4HEXDIG 7(":" 1*4HEXDIG)
    IPv6-comp   = [1*4HEXDIG *5(":" 1*4HEXDIG)] "::" [1*4HEXDIG *5(":" 1*4HEXDIG)]
    IPv6v4-full = 1*4HEXDIG 5(":" 1*4HEXDIG) ":" IPv4
    IPv6v4-comp = [1*4HEXDIG *3(":" 1*4HEXDIG)] "::" [1*4HEXDIG *3(":" 1*4HEXDIG) ":"] IPv4
    suffixe      = 1*3DIGIT ; Representing a decimal integer value in the range 0 through 128.
    IPv6        = (IPv6-full / IPv6-comp / IPv6v4-full / IPv6v4-comp) ["/" suffixe]
*/
const ipV4Seg = "(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])";
const ipV4Pattern = `(?:${ipV4Seg}\\.){3}${ipV4Seg}`;
const ipV4Regex = new RegExp(`^${ipV4Pattern}$`);
const ipV4WithCidrExpectedRegex = weakly(() => new RegExp(`^${ipV4Pattern}/(3[0-2]|[12]?[0-9])$`));
const ipV4WithCidrAcceptedRegex = weakly(() => new RegExp(`^${ipV4Pattern}(?:/(3[0-2]|[12]?[0-9]))?$`));
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
const ipV6Regex = new RegExp(`^${ipV6Pattern}$`);
const ipV6WithCidrExpectedRegex = weakly(() => new RegExp(`^${ipV6Pattern}/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$`));
const ipV6WithCidrAcceptedRegex = weakly(() => new RegExp(`^${ipV6Pattern}(?:/(12[0-8]|1[01][0-9]|[1-9]?[0-9]))?$`));
function checkArguments(str, options) {
    if (typeof str !== "string") {
        throw new Error("The 'str' argument must be of type string.");
    }
    if (options !== undefined) {
        if (typeof options !== "object") {
            throw new Error("The 'options' argument must be of type object.");
        }
        if (options.cidr !== undefined && typeof options.cidr !== "string") {
            throw new Error("The 'cidr' property of the 'options' argument must be of type string.");
        }
    }
}
/**
 * **Standard:** No standard
 *
 * @version 2.0.0
 */
function isIp(str, options) {
    checkArguments(str, options);
    if (options?.cidr === undefined || options.cidr === "reject") {
        if (ipV4Regex.test(str))
            return (true);
        if (ipV6Regex.test(str))
            return (true);
    }
    else if (options.cidr === "expect") {
        if (ipV4WithCidrExpectedRegex().test(str))
            return (true);
        if (ipV6WithCidrExpectedRegex().test(str))
            return (true);
    }
    else if (options.cidr === "accept") {
        if (ipV4WithCidrAcceptedRegex().test(str))
            return (true);
        if (ipV6WithCidrAcceptedRegex().test(str))
            return (true);
    }
    else {
        throw new Error("The 'options.cidr' property must be a known string.");
    }
    return (false);
}
/**
 * **Standard:** No standard
 *
 * @version 2.0.0
 */
function isIpV4(str, options) {
    checkArguments(str, options);
    if (options?.cidr === undefined || options.cidr === "reject") {
        if (ipV4Regex.test(str))
            return (true);
    }
    else if (options.cidr === "expect") {
        if (ipV4WithCidrExpectedRegex().test(str))
            return (true);
    }
    else if (options.cidr === "accept") {
        if (ipV4WithCidrAcceptedRegex().test(str))
            return (true);
    }
    else {
        throw new Error("The 'options.cidr' property must be a known string.");
    }
    return (false);
}
/**
 * **Standard:** No standard
 *
 * @version 2.0.0
 */
function isIpV6(str, options) {
    checkArguments(str, options);
    if (options?.cidr === undefined || options.cidr === "reject") {
        if (ipV6Regex.test(str))
            return (true);
    }
    else if (options.cidr === "expect") {
        if (ipV6WithCidrExpectedRegex().test(str))
            return (true);
    }
    else if (options.cidr === "accept") {
        if (ipV6WithCidrAcceptedRegex().test(str))
            return (true);
    }
    else {
        throw new Error("The 'options.cidr' property must be a known string.");
    }
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
    if (typeof str !== "string") {
        throw new Error("The 'str' argument must be of type string.");
    }
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
const localDotPattern = "(?:[-!=?A-B\\x23-\\x27\\x2A-\\x2B\\x2F-\\x39\\x5E-\\x7E]+(?:\\.[-!=?A-B\\x23-\\x27\\x2A-\\x2B\\x2F-\\x39\\x5E-\\x7E]+)*)";
const localQuotePattern = "(?:\"(?:[\\x20-\\x21\\x23-\\x5B\\x5D-\\x7E]|\\\\[\\x20-\\x7E])*\")";
const localDotRegex = new RegExp(`^${localDotPattern}$`);
const localDotOrLocalQuoteRegex = weakly(() => new RegExp(`^(?:${localDotPattern}|${localQuotePattern})$`));
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
function validateLocal(str, options) {
    if (localDotRegex.test(str))
        return (true);
    if (options?.allowLocalQuote
        && localDotOrLocalQuoteRegex().test(str))
        return (true);
    return (false);
}
function validateDomain(str, options) {
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
    if (typeof str !== "string") {
        throw new Error("The 'str' argument must be of type string.");
    }
    if (options !== undefined) {
        if (typeof options !== "object") {
            throw new Error("The 'options' argument must be of type object.");
        }
        if (options.allowLocalQuote !== undefined && typeof options.allowLocalQuote !== "boolean") {
            throw new Error("The 'allowLocalQuote' property of the 'options' argument must be of type boolean.");
        }
        if (options.allowIpAddress !== undefined && typeof options.allowIpAddress !== "boolean") {
            throw new Error("The 'allowIpAddress' property of the 'options' argument must be of type boolean.");
        }
        if (options.allowGeneralAddress !== undefined && typeof options.allowGeneralAddress !== "boolean") {
            throw new Error("The 'allowGeneralAddress' property of the 'options' argument must be of type boolean.");
        }
    }
    const email = parseEmail(str);
    if (!email)
        return (false);
    // VALIDATE LOCAL
    if (!validateLocal(email.local, options))
        return (false);
    // VALIDATE DOMAIN
    if (!validateDomain(email.domain, options))
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
    if (typeof str !== "string") {
        throw new Error("The 'str' argument must be of type string.");
    }
    if (options !== undefined) {
        if (typeof options !== "object") {
            throw new Error("The 'options' argument must be of type object.");
        }
        if (options.type !== undefined && !isArray(options.type)) {
            throw new Error("The 'type' property of the 'options' argument must be of type string.");
        }
        if (options.subtype !== undefined && !isArray(options.subtype)) {
            throw new Error("The 'subtype' property of the 'options' argument must be of type string.");
        }
    }
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
        const hasIdenticalName = dataUrl.parameters.some(({ name }, j) => j !== i && name.toLowerCase() === name.toLowerCase());
        if (hasIdenticalName)
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
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-8
 *
 * @version 1.0.0
 */
function isBase16(str, options) {
    if (typeof str !== "string") {
        throw new Error("The 'str' argument must be of type string.");
    }
    return (str.length % 2 === 0 && base16Regex.test(str));
}
/**
 * **Standard :** RFC 4648
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-6
 *
 * @version 1.0.0
 */
function isBase32(str, options) {
    if (typeof str !== "string") {
        throw new Error("The 'str' argument must be of type string.");
    }
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
    if (typeof str !== "string") {
        throw new Error("The 'str' argument must be of type string.");
    }
    return (str.length % 8 === 0 && base32HexRegex().test(str));
}
/**
 * **Standard :** RFC 4648
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-4
 *
 * @version 1.0.0
 */
function isBase64(str, options) {
    if (typeof str !== "string") {
        throw new Error("The 'str' argument must be of type string.");
    }
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
    if (typeof str !== "string") {
        throw new Error("The 'str' argument must be of type string.");
    }
    return (str.length % 4 === 0 && base64UrlRegex().test(str));
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

const UndefinedFormat = {
    type: "undefined",
    exceptions: {},
    mount(chunk, criteria) {
        return (null);
    },
    check(chunk, criteria, value) {
        if (value !== undefined) {
            return ("TYPE_UNDEFINED_UNSATISFIED");
        }
        return (null);
    }
};

const FunctionFormat = {
    type: "function",
    exceptions: {
        NATURE_PROPERTY_MISDECLARED: "The 'nature' property must be of type string.",
        NATURE_PROPERTY_STRING_MISCONFIGURED: "The 'nature' property must be a known string.",
        NATURE_PROPERTY_ARRAY_MISCONFIGURED: "The array of the 'nature' must have a number of items greater than 0.",
        NATURE_PROPERTY_ARRAY_ITEM_MISDECLARED: "The array items of the 'nature' property must be of type string.",
        NATURE_PROPERTY_ARRAY_ITEM_MISCONFIGURED: "The array items of the 'nature' property must be known strings."
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
                    return ("NATURE_PROPERTY_ARRAY_MISCONFIGURED");
                }
                for (const item of nature) {
                    if (typeof item !== "string") {
                        return ("NATURE_PROPERTY_ARRAY_ITEM_MISCONFIGURED");
                    }
                    if (!(item in this.natureBitflags)) {
                        return ("NATURE_PROPERTY_ARRAY_ITEM_MISCONFIGURED");
                    }
                }
            }
            else {
                return ("NATURE_PROPERTY_MISDECLARED");
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
        LITERAL_PROPERTY_MISDECLARED: "The 'literal' property must be of type boolean."
    },
    mount(chunk, criteria) {
        const { literal } = criteria;
        if (literal !== undefined && typeof literal !== "boolean") {
            return ("LITERAL_PROPERTY_MISDECLARED");
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
    }
};

const UnknownFormat = {
    type: "unknown",
    exceptions: {},
    mount(chunk, criteria) {
        return (null);
    },
    check(chunk, criteria, value) {
        return (null);
    }
};

const SymbolFormat = {
    type: "symbol",
    exceptions: {
        LITERAL_PROPERTY_MISDECLARED: "The 'literal' property must be of type symbol, array or plain object.",
        LITERAL_PROPERTY_ARRAY_MISCONFIGURED: "The array of the 'literal' property must have a number of items greater than 0.",
        LITERAL_PROPERTY_ARRAY_ITEM_MISDECLARED: "The array items of the 'literal' property must be of type symbol.",
        LITERAL_PROPERTY_OBJECT_MISCONFIGURED: "The object of the 'literal' property must must have a number of keys greater than 0.",
        LITERAL_PROPERTY_OBJECT_KEY_MISDECLARED: "The object keys of the 'literal' property must be of type string.",
        LITERAL_PROPERTY_OBJECT_VALUE_MISDECLARED: "The object values of the 'literal' property must be of type symbol.",
        CUSTOM_PROPERTY_MISDECLARED: "The 'custom' property must be of type basic function."
    },
    mount(chunk, criteria) {
        const { literal, custom } = criteria;
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
                        return ("LITERAL_PROPERTY_ARRAY_ITEM_MISDECLARED");
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
                        return ("LITERAL_PROPERTY_OBJECT_KEY_MISDECLARED");
                    }
                    if (typeof literal[key] !== "symbol") {
                        return ("LITERAL_PROPERTY_OBJECT_VALUE_MISDECLARED");
                    }
                }
                resolvedLiteral = new Set(Object.values(literal));
            }
            else {
                return ("LITERAL_PROPERTY_MISDECLARED");
            }
            Object.assign(criteria, { resolvedLiteral });
        }
        if (custom !== undefined && !isFunction(custom)) {
            return ("CUSTOM_PROPERTY_MISDECLARED");
        }
        return (null);
    },
    check(chunk, criteria, value) {
        if (typeof value !== "symbol") {
            return ("TYPE_SYMBOL_UNSATISFIED");
        }
        const { resolvedLiteral, custom } = criteria;
        if (resolvedLiteral !== undefined && !resolvedLiteral.has(value)) {
            return ("LITERAL_UNSATISFIED");
        }
        if (custom && !custom(value)) {
            return ("CUSTOM_UNSATISFIED");
        }
        return (null);
    }
};

const NumberFormat = {
    type: "number",
    exceptions: {
        MIN_PROPERTY_MISDECLARED: "The 'min' property must be of type number.",
        MAX_PROPERTY_MISDECLARED: "The 'max' property must be of type number.",
        MIN_MAX_PROPERTIES_MISCONFIGURED: "The 'max' property cannot be less than 'min' property.",
        LITERAL_PROPERTY_MISDECLARED: "The 'literal' property must be of type number, array or plain object.",
        LITERAL_PROPERTY_ARRAY_MISCONFIGURED: "The array of the 'literal' property must have a number of items greater than 0.",
        LITERAL_PROPERTY_ARRAY_ITEM_MISDECLARED: "The array items of the 'literal' property must be of type number.",
        LITERAL_PROPERTY_OBJECT_MISCONFIGURED: "The object of the 'literal' property must have a number of keys greater than 0.",
        LITERAL_PROPERTY_OBJECT_KEY_MISDECLARED: "The object keys of the 'literal' property must be of type string.",
        LITERAL_PROPERTY_OBJECT_VALUE_MISDECLARED: "The object values of the 'literal' property must be of type number.",
        CUSTOM_PROPERTY_MISDECLARED: "The 'custom' property must be of type basic function."
    },
    mount(chunk, criteria) {
        const { min, max, literal, custom } = criteria;
        if (min !== undefined && typeof min !== "number") {
            return ("MIN_PROPERTY_MISDECLARED");
        }
        if (max !== undefined && typeof max !== "number") {
            return ("MAX_PROPERTY_MISDECLARED");
        }
        if (min !== undefined && max !== undefined && min > max) {
            return ("MIN_MAX_PROPERTIES_MISCONFIGURED");
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
                        return ("LITERAL_PROPERTY_ARRAY_ITEM_MISDECLARED");
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
                        return ("LITERAL_PROPERTY_OBJECT_KEY_MISDECLARED");
                    }
                    if (typeof literal[key] !== "number") {
                        return ("LITERAL_PROPERTY_OBJECT_VALUE_MISDECLARED");
                    }
                }
                resolvedLiteral = new Set(Object.values(literal));
            }
            else {
                return ("LITERAL_PROPERTY_MISDECLARED");
            }
            Object.assign(criteria, { resolvedLiteral });
        }
        if (custom !== undefined && !isFunction(custom)) {
            return ("CUSTOM_PROPERTY_MISDECLARED");
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
        MIN_PROPERTY_MISDECLARED: "The 'min' property must be of type number.",
        MAX_PROPERTY_MISDECLARED: "The 'max' property must be of type number.",
        MIN_MAX_PROPERTIES_MISCONFIGURED: "The 'min' property cannot be greater than 'max' property.",
        REGEX_PROPERTY_MISDECLARED: "The 'regex' property must be of type RegExp object.",
        LITERAL_PROPERTY_MISDECLARED: "The 'literal' property must be of type string, array or plain object.",
        LITERAL_PROPERTY_ARRAY_MISCONFIGURED: "The array of the 'literal' property must have a number of items greater than 0.",
        LITERAL_PROPERTY_ARRAY_ITEM_MISDECLARED: "The array items of the 'literal' property must be of type String.",
        LITERAL_PROPERTY_OBJECT_MISCONFIGURED: "The object of the 'literal' property must have a number of keys greater than 0.",
        LITERAL_PROPERTY_OBJECT_KEY_MISDECLARED: "The object keys of the 'literal' property must be of type string.",
        LITERAL_PROPERTY_OBJECT_VALUE_MISDECLARED: "The object values of the 'literal' property must be of type string.",
        CONSTRAINT_PROPERTY_MISDECLARED: "The 'constraint' property must be of type Plain Object.",
        CONSTRAINT_PROPERTY_OBJECT_MISCONFIGURED: "The object of the 'constraint' property must have a number of keys greater than 0.",
        CONSTRAINT_PROPERTY_OBJECT_KEY_MISDECLARED: "The object keys of the 'constraint' property must be of type string.",
        CONSTRAINT_PROPERTY_OBJECT_KEY_MISCONFIGURED: "The object keys of the 'constraint' property must be a known string.",
        CONSTRAINT_PROPERTY_OBJECT_VALUE_MISDECLARED: "The object values of the 'constraint' property must be of type true or plain object.",
        CUSTOM_PROPERTY_MISDECLARED: "The 'custom' property must be of type basic function."
    },
    mount(chunk, criteria) {
        const { min, max, regex, literal, constraint, custom } = criteria;
        if (min !== undefined && typeof min !== "number") {
            return ("MIN_PROPERTY_MISDECLARED");
        }
        if (max !== undefined && typeof max !== "number") {
            return ("MAX_PROPERTY_MISDECLARED");
        }
        if (min !== undefined && max !== undefined && min > max) {
            return ("MIN_MAX_PROPERTIES_MISCONFIGURED");
        }
        if (regex !== undefined && !(regex instanceof RegExp)) {
            return ("REGEX_PROPERTY_MISDECLARED");
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
                        return ("LITERAL_PROPERTY_ARRAY_ITEM_MISDECLARED");
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
                        return ("LITERAL_PROPERTY_OBJECT_KEY_MISDECLARED");
                    }
                    if (typeof literal[key] !== "string") {
                        return ("LITERAL_PROPERTY_OBJECT_VALUE_MISDECLARED");
                    }
                }
                resolvedLiteral = new Set(Object.values(literal));
            }
            else {
                return ("LITERAL_PROPERTY_MISDECLARED");
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
                        return ("CONSTRAINT_PROPERTY_OBJECT_KEY_MISDECLARED");
                    }
                    if (!stringTesters.has(key)) {
                        return ("CONSTRAINT_PROPERTY_OBJECT_KEY_MISCONFIGURED");
                    }
                    const value = constraint[key];
                    if (typeof value !== "boolean" && !isPlainObject(value)) {
                        return ("CONSTRAINT_PROPERTY_OBJECT_VALUE_MISDECLARED");
                    }
                    if (value === false)
                        continue;
                    if (value === true) {
                        resolvedConstraint.set(key, undefined);
                    }
                    else {
                        resolvedConstraint.set(key, value);
                    }
                }
                Object.assign(criteria, { resolvedConstraint });
            }
            else {
                return ("CONSTRAINT_PROPERTY_MISDECLARED");
            }
        }
        if (custom !== undefined && !isFunction(custom)) {
            return ("CUSTOM_PROPERTY_MISDECLARED");
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

const ObjectFormat = {
    type: "object",
    exceptions: {
        NATURE_PROPERTY_MISDECLARED: "The 'nature' property must be of type string.",
        NATURE_PROPERTY_MISCONFIGURED: "The 'nature' property must be a known string.",
        MIN_PROPERTY_MISDECLARED: "The 'min' property must be of type number.",
        MAX_PROPERTY_MISDECLARED: "The 'max' property must be of type number.",
        MAX_MIN_PROPERTIES_MISCONFIGURED: "The 'max' property cannot be less than 'min' property.",
        SHAPE_PROPERTY_MISDECLARED: "The 'shape' property must be of type plain object.",
        SHAPE_PROPERTY_OBJECT_VALUE_MISDECLARED: "The object values of the 'shape' property must be of type plain object.",
        SHAPE_MIN_PROPERTIES_MISCONFIGURED: "The object of the 'shape' property must have a number of properties less than the 'min' property.",
        SHAPE_MAX_PROPERTIES_MISCONFIGURED: "The object of the 'shape' property must have a number of properties less than the 'max' property.",
        SHAPE_MIN_MAX_PROPERTIES_KEYS_VALUES_PROPERTIES_UNDEFINED: "The 'shape' property with the 'min' property or/and 'max' property cannot be defined without the 'keys' property or 'values' property.",
        OPTIONAL_PROPERTY_MISDECLARED: "The 'optional' property must be of type boolean or array.",
        OPTIONAL_PROPERTY_ARRAY_ITEM_MISDECLARED: "The array items of the 'optional' property must be of type string or symbol.",
        OPTIONAL_PROPERTY_SHAPE_PROPERTY_UNDEFINED: "The 'optional' property cannot be defined without the 'shape' property.",
        KEYS_PROPERTY_MISDECLARED: "The 'keys' property must be of type plain object.",
        KEYS_PROPERTY_OBJECT_TYPE_PROPERTY_UNDEFINED: "The object's 'type' property of the 'keys' property must be defined.",
        KEYS_PROPERTY_OBJECT_TYPE_PROPERTY_MISDECLARED: "The object's 'type' property of the 'keys' property must be of type string.",
        KEYS_PROPERTY_OBJECT_TYPE_PROPERTY_MISCONFIGURED: "The object's 'type' property of the 'keys' property must be 'string' or 'symbol'.",
        VALUES_PROPERTY_MISDECLARED: "The 'values' property must be of type plain object."
    },
    natures: ["PLAIN"],
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
        const { nature, min, max, shape, optional, keys, values } = criteria;
        const resolvedOptional = optional ?? false;
        if (nature !== undefined) {
            if (typeof nature !== "string") {
                return ("NATURE_PROPERTY_MISDECLARED");
            }
            if (!this.natures.includes(nature)) {
                return ("NATURE_PROPERTY_MISCONFIGURED");
            }
        }
        if (min !== undefined && typeof min !== "number") {
            return ("MIN_PROPERTY_MISDECLARED");
        }
        if (max !== undefined && typeof max !== "number") {
            return ("MAX_PROPERTY_MISDECLARED");
        }
        if (min !== undefined && max !== undefined && min > max) {
            return ("MAX_MIN_PROPERTIES_MISCONFIGURED");
        }
        if (shape !== undefined) {
            if (!isPlainObject(shape)) {
                return ("SHAPE_PROPERTY_MISDECLARED");
            }
            if ((min !== undefined || max !== undefined)
                && !("keys" in criteria)
                && !("values" in criteria)) {
                return ("SHAPE_MIN_MAX_PROPERTIES_KEYS_VALUES_PROPERTIES_UNDEFINED");
            }
            const shapeKeys = Reflect.ownKeys(shape);
            const shapeKeysLength = shapeKeys.length;
            if (min !== undefined && min < shapeKeysLength) {
                return ("SHAPE_MIN_PROPERTIES_MISCONFIGURED");
            }
            if (max !== undefined && max < shapeKeysLength) {
                return ("SHAPE_MAX_PROPERTIES_MISCONFIGURED");
            }
            for (let i = 0; i < shapeKeysLength; i++) {
                const key = shapeKeys[i];
                let node = shape[key];
                if (!isPlainObject(node)) {
                    return ("SHAPE_PROPERTY_OBJECT_VALUE_MISDECLARED");
                }
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
            Object.assign(criteria, {
                declaredKeySet: new Set(shapeKeys),
                unforcedKeySet: new Set(this.getUnforcedKeys(resolvedOptional, shapeKeys)),
                enforcedKeySet: new Set(this.getEnforcedKeys(resolvedOptional, shapeKeys))
            });
        }
        if (optional !== undefined) {
            if (isArray(optional)) {
                for (const item of optional) {
                    if (typeof item !== "string" && typeof item !== "symbol") {
                        return ("OPTIONAL_PROPERTY_ARRAY_ITEM_MISDECLARED");
                    }
                }
            }
            else if (typeof optional !== "boolean") {
                return ("OPTIONAL_PROPERTY_MISDECLARED");
            }
            if (shape === undefined) {
                return ("OPTIONAL_PROPERTY_SHAPE_PROPERTY_UNDEFINED");
            }
            Object.assign(criteria, {
                optional: resolvedOptional
            });
        }
        if (keys !== undefined) {
            if (!isPlainObject(keys)) {
                return ("KEYS_PROPERTY_MISDECLARED");
            }
            if (!("type" in keys)) {
                return ("KEYS_PROPERTY_OBJECT_TYPE_PROPERTY_UNDEFINED");
            }
            if (typeof keys.type !== "string") {
                return ("KEYS_PROPERTY_OBJECT_TYPE_PROPERTY_MISDECLARED");
            }
            if (keys.type !== "string" && keys.type !== "symbol") {
                return ("KEYS_PROPERTY_OBJECT_TYPE_PROPERTY_MISCONFIGURED");
            }
            chunk.push({
                node: keys,
                partPath: {
                    explicit: ["keys"],
                    implicit: []
                }
            });
        }
        if (values !== undefined) {
            if (!isPlainObject(values)) {
                return ("VALUES_PROPERTY_MISDECLARED");
            }
            chunk.push({
                node: values,
                partPath: {
                    explicit: ["values"],
                    implicit: ["%", "string", "symbol"]
                }
            });
        }
        return (null);
    },
    check(chunk, criteria, data) {
        if (!isObject(data)) {
            return ("TYPE_OBJECT_UNSATISFIED");
        }
        const { nature, min, max, shape, keys, values, declaredKeySet, unforcedKeySet, enforcedKeySet } = criteria;
        if (nature === "PLAIN" && !isPlainObject(data)) {
            return ("NATURE_PLAIN_UNSATISFIED");
        }
        const definedKeyArray = Reflect.ownKeys(data);
        const definedKeyCount = definedKeyArray.length;
        if (min !== undefined && definedKeyCount < min) {
            return ("MIN_UNSATISFIED");
        }
        if (max !== undefined && definedKeyCount > max) {
            return ("MAX_UNSATISFIED");
        }
        if (shape !== undefined) {
            const declaredKeyCount = declaredKeySet.size;
            const enforcedKeyCount = enforcedKeySet.size;
            if (definedKeyCount < enforcedKeyCount) {
                return ("SHAPE_UNSATISFIED");
            }
            if (keys === undefined && values === undefined) {
                if (definedKeyCount > declaredKeyCount) {
                    return ("SHAPE_UNSATISFIED");
                }
                let enforcedMissing = enforcedKeyCount;
                for (let i = 0; i < definedKeyCount; i++) {
                    const key = definedKeyArray[i];
                    if (enforcedKeySet.has(key)) {
                        enforcedMissing--;
                    }
                    else if (enforcedMissing > i) {
                        return ("SHAPE_UNSATISFIED");
                    }
                    else if (!unforcedKeySet.has(key)) {
                        return ("SHAPE_UNSATISFIED");
                    }
                    chunk.push({
                        data: data[key],
                        node: shape[key]
                    });
                }
            }
            else {
                let enforcedMissing = enforcedKeyCount;
                for (let i = 0; i < definedKeyCount; i++) {
                    const key = definedKeyArray[i];
                    if (enforcedKeySet.has(key)) {
                        enforcedMissing--;
                    }
                    else if (enforcedMissing > i) {
                        return ("SHAPE_UNSATISFIED");
                    }
                    else if (!unforcedKeySet.has(key)) {
                        if (keys !== undefined) {
                            chunk.push({
                                data: key,
                                node: keys
                            });
                        }
                        if (values !== undefined) {
                            chunk.push({
                                data: data[key],
                                node: values
                            });
                        }
                        continue;
                    }
                    chunk.push({
                        data: data[key],
                        node: shape[key]
                    });
                }
            }
        }
        if (shape === undefined && keys !== undefined) {
            for (let i = 0; i < definedKeyCount; i++) {
                const key = definedKeyArray[i];
                chunk.push({
                    data: key,
                    node: keys
                });
            }
        }
        if (shape === undefined && values !== undefined) {
            for (let i = 0; i < definedKeyCount; i++) {
                const key = definedKeyArray[i];
                chunk.push({
                    data: data[key],
                    node: values
                });
            }
        }
        return (null);
    }
};

const ArrayFormat = {
    type: "array",
    exceptions: {
        MIN_PROPERTY_MISDECLARED: "The 'min' property must be of type number.",
        MAX_PROPERTY_MISDECLARED: "The 'max' property must be of type number.",
        MIN_MAX_PROPERTIES_MISCONFIGURED: "The 'max' property cannot be less than 'min' property.",
        TUPLE_PROPERTY_MISDECLARED: "The 'tuple' property must be of type array.",
        TUPLE_PROPERTY_ARRAY_ITEM_MISDECLARED: "The array items of the 'tuple' property must be of type array or plain object.",
        TUPLE_MIN_PROPERTIES_MISCONFIGURED: "The array of the 'tuple' property must have a number of items less than the 'min' property.",
        TUPLE_MAX_PROPERTIES_MISCONFIGURED: "The array of the 'tuple' property must have a number of items less than the 'max' property.",
        TUPLE_MIN_MAX_PROPERTIES_ITEMS_PROPERTY_UNDEFINED: "The 'tuple' property with the 'min' property or/and 'max' property cannot be defined without the 'items' property.",
        ITEMS_PROPERTY_MISDECLARED: "The 'items' property must be of type object."
    },
    isShorthandTuple(obj) {
        return (isArray(obj));
    },
    mount(chunk, criteria) {
        const { min, max, tuple, items } = criteria;
        if (min !== undefined && typeof min !== "number") {
            return ("MIN_PROPERTY_MISDECLARED");
        }
        if (max !== undefined && typeof max !== "number") {
            return ("MAX_PROPERTY_MISDECLARED");
        }
        if (min !== undefined && max !== undefined && min > max) {
            return ("MIN_MAX_PROPERTIES_MISCONFIGURED");
        }
        if (tuple !== undefined) {
            if (!isArray(tuple)) {
                return ("TUPLE_PROPERTY_MISDECLARED");
            }
            if ((min !== undefined || max !== undefined) && !("items" in criteria)) {
                return ("TUPLE_MIN_MAX_PROPERTIES_ITEMS_PROPERTY_UNDEFINED");
            }
            const tupleLength = tuple.length;
            if (min !== undefined && min < tupleLength) {
                return ("TUPLE_MIN_PROPERTIES_MISCONFIGURED");
            }
            if (max !== undefined && max < tupleLength) {
                return ("TUPLE_MAX_PROPERTIES_MISCONFIGURED");
            }
            for (let i = 0; i < tupleLength; i++) {
                let node = tuple[i];
                if (!isPlainObject(node) && !isArray(node)) {
                    return ("TUPLE_PROPERTY_ARRAY_ITEM_MISDECLARED");
                }
                if (this.isShorthandTuple(node)) {
                    node = {
                        type: "array",
                        tuple: node
                    };
                    tuple[i] = node;
                }
                chunk.push({
                    node: node,
                    partPath: {
                        explicit: ["tuple", i],
                        implicit: ["&", i]
                    }
                });
            }
        }
        if (items !== undefined) {
            if (!isPlainObject(items)) {
                return ("ITEMS_PROPERTY_MISDECLARED");
            }
            if (items.type !== "unknown") {
                chunk.push({
                    node: items,
                    partPath: {
                        explicit: ["items"],
                        implicit: ["%", "number"]
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
        const { min, max, tuple, items } = criteria;
        const declaredLength = tuple?.length ?? 0;
        const definedLength = data.length;
        if (min !== undefined && definedLength < min) {
            return ("MIN_UNSATISFIED");
        }
        if (max !== undefined && definedLength > max) {
            return ("MAX_UNSATISFIED");
        }
        if (tuple !== undefined) {
            if (definedLength < declaredLength) {
                return ("TUPLE_UNSATISFIED");
            }
            if (!items && definedLength > declaredLength) {
                return ("TUPLE_UNSATISFIED");
            }
            for (let i = 0; i < declaredLength; i++) {
                chunk.push({
                    data: data[i],
                    node: tuple[i]
                });
            }
        }
        if (items !== undefined) {
            if (declaredLength === definedLength || items.type === "unknown") {
                return (null);
            }
            for (let i = declaredLength; i < definedLength; i++) {
                chunk.push({
                    data: data[i],
                    node: items
                });
            }
        }
        return (null);
    }
};

const UnionFormat = {
    type: "union",
    exceptions: {
        UNION_PROPERTY_UNDEFINED: "The 'union' property must be defined.",
        UNION_PROPERTY_MISDECLARED: "The 'union' property must be of type array.",
        UNION_PROPERTY_ARRAY_MISCONFIGURED: "The array of the 'union' property must have a number of items greater than 0.",
        UNION_PROPERTY_ARRAY_ITEM_MISDECLARED: "The array items of the 'union' property must be of type plain object.",
    },
    mount(chunk, criteria) {
        if (!("union" in criteria)) {
            return ("UNION_PROPERTY_UNDEFINED");
        }
        const union = criteria.union;
        const unionLength = union.length;
        if (!isArray(union)) {
            return ("UNION_PROPERTY_MISDECLARED");
        }
        if (unionLength < 1) {
            return ("UNION_PROPERTY_ARRAY_MISCONFIGURED");
        }
        for (let i = 0; i < unionLength; i++) {
            const node = union[i];
            if (!isPlainObject(node) && !isArray(node)) {
                return ("UNION_PROPERTY_ARRAY_ITEM_MISDECLARED");
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
        let rejectionCount = 0;
        const hook = {
            onAccept() {
                return ({
                    action: "CANCEL",
                    target: "CHUNK"
                });
            },
            onReject() {
                if (++rejectionCount === unionLength) {
                    return ({
                        action: "REJECT",
                        code: "UNION_UNSATISFIED"
                    });
                }
                return ({
                    action: "CANCEL",
                    target: "BRANCH"
                });
            }
        };
        for (let i = 0; i < unionLength; i++) {
            chunk.push({
                hook,
                data,
                node: union[i],
            });
        }
        return (null);
    }
};

const NullFormat = {
    type: "null",
    exceptions: {},
    mount(chunk, criteria) {
        return (null);
    },
    check(chunk, criteria, value) {
        if (value !== null) {
            return ("TYPE_NULL_UNSATISFIED");
        }
        return (null);
    }
};

const formatNatives = [
    UndefinedFormat,
    FunctionFormat,
    BooleanFormat,
    UnknownFormat,
    SymbolFormat,
    NumberFormat,
    StringFormat,
    ObjectFormat,
    ArrayFormat,
    UnionFormat,
    NullFormat
];

/**
 * The `Schema` class is used to define and validate data structures, ensuring they conform to criteria node.
 */
class Schema {
    initiate(criteria) {
        if (!isPlainObject(criteria)) {
            throw new SchemaException("The 'criteria' parameter must be of type plain object.");
        }
        this.managers.formats.add(formatNatives);
        this.mountedCriteria = mounter(this.managers, cloner(criteria));
    }
    constructor(criteria) {
        this.managers = {
            formats: new FormatsManager(),
            events: new EventsManager()
        };
        this.listener = {
            on: this.managers.events.on,
            off: this.managers.events.off
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
            throw new SchemaException("The 'mountedCriteria' class property is not initialized.");
        }
        return (this.mountedCriteria);
    }
    /**
     * Validates the provided data against the schema.
     *
     * @param data - The data to be validated.
     *
     * @returns A boolean.
     */
    validate(data) {
        return (checker(this.managers, this.criteria, data).success);
    }
    /**
     * Evaluates the provided data against the schema.
     *
     * @param data - The data to be evaluated.
     */
    evaluate(data) {
        return (checker(this.managers, this.criteria, data));
    }
}

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

export { Schema, SchemaDataAdmission, SchemaDataRejection, SchemaException, SchemaFactory, SchemaNodeException, base16ToBase32, base16ToBase64, base32ToBase16, base64ToBase16, getInternalTag, helpers, isArray, isAscii, isAsyncFunction, isAsyncGeneratorFunction, isBase16, isBase32, isBase32Hex, isBase64, isBase64Url, isDataUrl, isDomain, isEmail, isFunction, isGeneratorFunction, isIp, isIpV4, isIpV6, isObject, isPlainObject, isTypedArray, isUuid, testers };
