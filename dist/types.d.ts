type LooseAutocomplete<T extends string> = T | Omit<string, T>;

interface NodePaths {
    /**
     * **Composition of explicit path :**
     * ```py
     * segment = (string / number / symbol)
     * path    = [*(...segment)]
     * ```
     *
     * **Exemple :**
     *  ```py
     * my-path = ["struct", "products", "item", "price"]
     * ```
    */
    explicit: (string | number | symbol)[];
    /**
     * #### Composition of implicit path :
     * ```py
     * dynamic-key   = ["%", 1*3("string" / "number" / "symbol")]
     * static-key    = ["&", (string / number / symbol)]
     * segment       = dynamic-key / static-key
     * path          = [*(...segment)]
     * ```
     *
     * #### Exemple :
     * ```py
     * my-path = ["&", "products", "%", "number", "&", "price"]
     * my-path is products[0].price or products[1].price and continue
     * ```
    */
    implicit: (LooseAutocomplete<"&" | "%" | "@" | "string" | "number" | "symbol"> | number | symbol)[];
}
interface MounterChunkTask {
    node: SetableCriteria | MountedCriteria;
    partPaths: NodePaths;
}
type MounterChunk = MounterChunkTask[];
interface CheckerHooks<R extends string = string> {
    onAccept(): {
        action: "DEFAULT";
    } | {
        action: "IGNORE";
        target: "CHUNK";
    } | {
        action: "REJECT";
        code: R;
    };
    onReject(reject: CheckerReject): {
        action: "DEFAULT";
    } | {
        action: "IGNORE";
        target: "CHUNK" | "BRANCH";
    } | {
        action: "REJECT";
        code: R;
    };
}
interface CheckerStackItemHooks extends CheckerHooks {
    owner: CheckerTask;
    index: {
        chunk: number;
        branch: number;
    };
}
interface CheckerTask {
    data: unknown;
    node: MountedCriteria;
    fullPaths: NodePaths;
    stackHooks?: CheckerStackItemHooks[];
}
interface CheckerChunkTask {
    data: CheckerTask['data'];
    node: CheckerTask['node'];
    hooks?: CheckerHooks;
}
type CheckerChunk = CheckerChunkTask[];
interface CheckerReject {
    path: NodePaths;
    /**
     * Syntax: `<FORMAT>.<RULE>[.<DETAIL>].<REASON>`
     *
     * Components:
     * - `<FORMAT>`    : The format involved (e.g. NUMBER, STRING, STRUCT)
     * - `<MEMBER>`      : The criterion involved (e.g. EMPTY, MIN, ENUM)
     * - `<DETAIL>`    : Specific detail or sub-aspect of the criteria (e.g. LENGTH, PATTERN)
     * - `<REASON>`    : The reason for rejection (e.g. NOT_SATISFIED, NOT_ALLOWED)
     */
    code: string;
    type: string;
    label: string | undefined;
    message: string | undefined;
}

declare const nodeSymbol: unique symbol;

interface BooleanSetableCriteria extends SetableCriteriaTemplate<"boolean"> {
}
interface BooleanDerivedCriteria extends DerivedCriteriaTemplate<{}, boolean> {
}

interface SymbolSetableCriteria extends SetableCriteriaTemplate<"symbol"> {
    symbol?: symbol;
}
interface SymbolDerivedCriteria extends DerivedCriteriaTemplate<{}, symbol> {
}
type SymbolRejects = "TYPE_SYMBOL_UNSATISFIED" | "SYMBOL_UNSATISFIED";

interface NumberSetableCriteria extends SetableCriteriaTemplate<"number"> {
    min?: number;
    max?: number;
    enum?: number[] | Record<string | number, number>;
    custom?: (input: number) => boolean;
}
type NumberGuardedCriteria<T extends NumberSetableCriteria> = T['enum'] extends number[] ? T['enum'][number] : T['enum'] extends Record<string | number, number> ? T['enum'][keyof T['enum']] : number;
interface NumberDerivedCriteria<T extends NumberSetableCriteria> extends DerivedCriteriaTemplate<{}, NumberGuardedCriteria<T>> {
}
type NumberErrors = "MIN_PROPERTY_MALFORMED" | "MAX_PROPERTY_MALFORMED" | "MIN_AND_MAX_PROPERTIES_MISCONFIGURED" | "ENUM_PROPERTY_MALFORMED" | "ENUM_PROPERTY_ARRAY_ITEM_MALFORMED" | "ENUM_PROPERTY_OBJECT_KEY_MALFORMED" | "ENUM_PROPERTY_OBJECT_VALUE_MALFORMED" | "CUSTOM_PROPERTY_MALFORMED";
type NumberRejects = "TYPE_NUMBER_UNSATISFIED" | "MIN_UNSATISFIED" | "MAX_UNSATISFIED" | "ENUM_UNSATISFIED" | "CUSTOM_UNSATISFIED";

interface BasicObject {
    [key: string | symbol | number]: unknown;
}
interface PlainObject {
    [key: string | symbol]: unknown;
}
interface BasicArray extends Array<unknown> {
}
interface TypedArray extends ArrayBufferView {
    [index: number]: number | bigint;
}
type BasicFunction = (...args: unknown[]) => unknown;
type AsyncFunction = (...args: unknown[]) => Promise<unknown>;

declare function isObject(x: unknown): x is BasicObject;
/**
 * A plain object is considered as follows:
 * - It must be an object.
 * - It must have a prototype of `Object.prototype` or `null`.
*/
declare function isPlainObject(x: unknown): x is PlainObject;
declare function isArray(x: unknown): x is BasicArray;
/**
 * A typed array is considered as follows:
 * - It must be a view on an ArrayBuffer.
 * - It must not be a `DataView`.
 */
declare function isTypedArray(x: unknown): x is TypedArray;
declare function isFunction(x: unknown): x is BasicFunction;
declare function isAsyncFunction(x: unknown): x is AsyncFunction;
declare function isGeneratorFunction(x: unknown): x is GeneratorFunction;
declare function isAsyncGeneratorFunction(x: unknown): x is AsyncGeneratorFunction;

declare const objectTesters_isArray: typeof isArray;
declare const objectTesters_isAsyncFunction: typeof isAsyncFunction;
declare const objectTesters_isAsyncGeneratorFunction: typeof isAsyncGeneratorFunction;
declare const objectTesters_isFunction: typeof isFunction;
declare const objectTesters_isGeneratorFunction: typeof isGeneratorFunction;
declare const objectTesters_isObject: typeof isObject;
declare const objectTesters_isPlainObject: typeof isPlainObject;
declare const objectTesters_isTypedArray: typeof isTypedArray;
declare namespace objectTesters {
  export {
    objectTesters_isArray as isArray,
    objectTesters_isAsyncFunction as isAsyncFunction,
    objectTesters_isAsyncGeneratorFunction as isAsyncGeneratorFunction,
    objectTesters_isFunction as isFunction,
    objectTesters_isGeneratorFunction as isGeneratorFunction,
    objectTesters_isObject as isObject,
    objectTesters_isPlainObject as isPlainObject,
    objectTesters_isTypedArray as isTypedArray,
  };
}

interface AsciiConfig {
    /** **Default:** `false` */
    onlyPrintable?: boolean;
}
/**
 * Check if all characters of the string are in the ASCII table (%d0-%d127).
 *
 * If you enable `onlyPrintable` valid characters will be limited to
 * printable characters from the ASCII table (%32-%d126).
 *
 * Empty returns `false`.
 */
declare function isAscii(str: string, config?: AsciiConfig): boolean;

interface UuidParams {
    /** **Default:** All versions are allowed */
    version?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
}
/**
 * **Standard :** RFC 9562
 *
 * @version 1.0.0
 */
declare function isUuid(str: string, params?: UuidParams): boolean;

interface EmailParams {
    /** **Default:** `false` */
    allowQuotedString?: boolean;
    /** **Default:** `false` */
    allowIpAddress?: boolean;
    /** **Default:** `false` */
    allowGeneralAddress?: boolean;
}
/**
 * **Standard :** RFC 5321
 *
 * @version 2.0.0
 */
declare function isEmail(str: string, params?: EmailParams): boolean;

/**
 * **Standard :** RFC 1035
 *
 * @version 1.0.0
 */
declare function isDomain(str: string, params?: undefined): boolean;

interface DataUrlParams {
    /**
     * Specifies the type of media.
     *
     * @see http://www.iana.org/assignments/media-types/
     */
    type: string[];
    /**
     * Specifies the sub-type of media.
     *
     * @see http://www.iana.org/assignments/media-types/
     */
    subtype: string[];
}
/**
 * **Standard :** RFC 2397 (RFC 2045, RFC 6838, RFC 3986)
 *
 * @version 2.0.0
 */
declare function isDataUrl(str: string, params?: DataUrlParams): boolean;

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
interface IpParams {
    /**
     * Allow prefixes at the end of IP addresses (e.g., `192.168.0.1/22`).
     *
     *
     * **Default:** `false`
     */
    allowPrefix?: boolean;
}
/**
 * **Standard:** No standard
 *
 * @version 1.0.0
 */
declare function isIp(str: string, params?: IpParams): boolean;
/**
 * **Standard:** No standard
 *
 * @version 1.0.0
 */
declare function isIpV4(str: string, params?: IpParams): boolean;
/**
 * **Standard:** No standard
 *
 * @version 1.0.0
 */
declare function isIpV6(str: string, params?: IpParams): boolean;

/**
 * **Standard :** RFC 4648
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-4
 *
 * @version 1.0.0
 */
declare function isBase64(str: string, params?: undefined): boolean;
/**
 * **Standard :** RFC 4648
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-5
 *
 * @version 1.0.0
 */
declare function isBase64Url(str: string, params?: undefined): boolean;
/**
 * **Standard :** RFC 4648
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-6
 *
 * @version 1.0.0
 */
declare function isBase32(str: string, params?: undefined): boolean;
/**
 * **Standard :** RFC 4648
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-7
 *
 * @version 1.0.0
 */
declare function isBase32Hex(str: string, params?: undefined): boolean;
/**
 * **Standard :** RFC 4648
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-8
 *
 * @version 1.0.0
 */
declare function isBase16(str: string, params?: undefined): boolean;

declare const stringTesters_isAscii: typeof isAscii;
declare const stringTesters_isBase16: typeof isBase16;
declare const stringTesters_isBase32: typeof isBase32;
declare const stringTesters_isBase32Hex: typeof isBase32Hex;
declare const stringTesters_isBase64: typeof isBase64;
declare const stringTesters_isBase64Url: typeof isBase64Url;
declare const stringTesters_isDataUrl: typeof isDataUrl;
declare const stringTesters_isDomain: typeof isDomain;
declare const stringTesters_isEmail: typeof isEmail;
declare const stringTesters_isIp: typeof isIp;
declare const stringTesters_isIpV4: typeof isIpV4;
declare const stringTesters_isIpV6: typeof isIpV6;
declare const stringTesters_isUuid: typeof isUuid;
declare namespace stringTesters {
  export {
    stringTesters_isAscii as isAscii,
    stringTesters_isBase16 as isBase16,
    stringTesters_isBase32 as isBase32,
    stringTesters_isBase32Hex as isBase32Hex,
    stringTesters_isBase64 as isBase64,
    stringTesters_isBase64Url as isBase64Url,
    stringTesters_isDataUrl as isDataUrl,
    stringTesters_isDomain as isDomain,
    stringTesters_isEmail as isEmail,
    stringTesters_isIp as isIp,
    stringTesters_isIpV4 as isIpV4,
    stringTesters_isIpV6 as isIpV6,
    stringTesters_isUuid as isUuid,
  };
}

declare const testers: {
    object: typeof objectTesters;
    string: typeof stringTesters;
};

type StringTesters = typeof testers.string;
type SetableTestersParams<T extends (input: any, params: any) => any> = T extends (input: any, params: infer U) => any ? U : never;
type SetableTesters = {
    [K in keyof StringTesters]?: SetableTestersParams<StringTesters[K]> | boolean;
};
interface StringSetableCriteria extends SetableTesters, SetableCriteriaTemplate<"string"> {
    /** @default true */
    empty?: boolean;
    min?: number;
    max?: number;
    enum?: string[] | Record<string | number, string>;
    regex?: string | RegExp;
    testers?: SetableTesters;
    custom?: (value: string) => boolean;
}
interface StringMountedCriteria<T extends StringSetableCriteria> {
    empty: unknown extends T['empty'] ? true : StringSetableCriteria['empty'] extends T['empty'] ? boolean : T['empty'];
    regex?: RegExp;
}
type EnumValues<T extends StringSetableCriteria> = T['enum'] extends Record<string | number, string> ? T['enum'][keyof T['enum']] : T['enum'] extends string[] ? T['enum'][number] : never;
type StringGuardedCriteria<T extends StringSetableCriteria> = T['enum'] extends (string[] | Record<string | number, string>) ? (EnumValues<T> | (T['empty'] extends true ? "" : never)) : string;
interface StringDerivedCriteria<T extends StringSetableCriteria> extends DerivedCriteriaTemplate<StringMountedCriteria<T>, StringGuardedCriteria<T>> {
}
type StringErrors = "EMPTY_PROPERTY_MALFORMED" | "MIN_PROPERTY_MALFORMED" | "MAX_PROPERTY_MALFORMED" | "MIN_MAX_PROPERTIES_MISCONFIGURED" | "ENUM_PROPERTY_MALFORMED" | "ENUM_PROPERTY_ARRAY_ITEM_MALFORMED" | "ENUM_PROPERTY_OBJECT_KEY_MALFORMED" | "ENUM_PROPERTY_OBJECT_VALUE_MALFORMED" | "REGEX_PROPERTY_MALFORMED" | "TESTERS_PROPERTY_MALFORMED" | "TESTERS_PROPERTY_OBJECT_KEY_MALFORMED" | "TESTERS_PROPERTY_OBJECT_VALUE_MALFORMED" | "CUSTOM_PROPERTY_MALFORMED";
type StringRejects$1 = "TYPE_STRING_UNSATISFIED" | "EMPTY_UNALLOWED" | "MIN_UNSATISFIED" | "MAX_UNSATISFIED" | "ENUM_UNSATISFIED" | "REGEX_UNSATISFIED" | "TESTERS_UNSATISFIED" | "CUSTOM_UNSATISFIED";
interface StringMembers {
    mountTesters: (definedTesters: Record<string | symbol, unknown>) => StringErrors | null;
    checkTesters: (definedTesters: Record<string, {} | undefined | boolean>, value: string) => StringRejects$1 | null;
}

type SimpleTypes = "null" | "undefined" | "nullish" | "unknown" | "basicFunction" | "asyncFunction";
interface SimpleSetableCriteria extends SetableCriteriaTemplate<"simple"> {
    simple: SimpleTypes;
}
interface SimpleMountedCriteria {
    bitcode: number;
}
type SimpleGuardedCriteria<T extends SimpleSetableCriteria> = T["simple"] extends "null" ? null : T["simple"] extends "undefined" ? undefined : T["simple"] extends "nullish" ? undefined | null : T["simple"] extends "unknown" ? unknown : T["simple"] extends "basicFunction" ? BasicFunction : T["simple"] extends "asyncFunction" ? AsyncFunction : never;
interface SimpleDerivedCriteria<T extends SimpleSetableCriteria> extends DerivedCriteriaTemplate<SimpleMountedCriteria, SimpleGuardedCriteria<T>> {
}
type SimpleErrors = "SIMPLE_PROPERTY_REQUIRED" | "SIMPLE_PROPERTY_MALFORMED" | "SIMPLE_PROPERTY_STRING_MISCONFIGURED";
type SimpleRejects = "SIMPLE_NULLISH_UNSATISFIED" | "SIMPLE_NULL_UNSATISFIED" | "SIMPLE_UNDEFINED_UNSATISFIED" | "SIMPLE_FUNCTION_UNSATISFIED" | "SIMPLE_ASYNC_FUNCTION_UNSATISFIED";
interface SimpleMembers {
    bitflags: Record<SimpleTypes, number>;
}

type SetableKey = SetableCriteria<"string" | "symbol">;
interface RecordSetableCriteria<T extends FormatTypes = FormatTypes> extends SetableCriteriaTemplate<"record"> {
    key: SetableKey;
    value: SetableCriteria<T>;
    strict?: boolean;
    empty?: boolean;
    min?: number;
    max?: number;
}
interface RecordMountedCriteria<T extends RecordSetableCriteria> {
    key: MountedCriteria<T['key']>;
    value: MountedCriteria<T['value']>;
    strict: unknown extends T['strict'] ? true : RecordSetableCriteria['strict'] extends T['strict'] ? boolean : T['strict'];
    empty: unknown extends T['empty'] ? true : RecordSetableCriteria['empty'] extends T['empty'] ? boolean : T['empty'];
}
type RecordGuardedCriteria<T extends RecordSetableCriteria> = GuardedCriteria<T['key']> extends infer U ? {
    [P in U as U extends (string | symbol) ? U : never]: GuardedCriteria<T['value']>;
} : never;
interface RecordDerivedCriteria<T extends RecordSetableCriteria> extends DerivedCriteriaTemplate<RecordMountedCriteria<T>, RecordGuardedCriteria<T>> {
}
type RecordErrors = "KEY_PROPERTY_REQUIRED" | "KEY_PROPERTY_MALFORMED" | "VALUE_PROPERTY_REQUIRED" | "VALUE_PROPERTY_MALFORMED" | "STRICT_PROPERTY_MALFORMED" | "EMPTY_PROPERTY_MALFORMED" | "MIN_PROPERTY_MALFORMED" | "MAX_PROPERTY_MALFORMED" | "MIN_AND_MAX_PROPERTIES_MISCONFIGURED";
type RecordRejects = "TYPE_PLAIN_OBJECT_UNSATISFIED" | "TYPE_OBJECT_UNSATISFIED" | "EMPTY_UNALLOWED" | "MIN_UNSATISFIED" | "MAX_UNSATISFIED";

type SetableStruct<T extends FormatTypes = FormatTypes> = {
    [key: string | symbol]: SetableCriteria<T> | SetableStruct<T>;
};
interface StructSetableCriteria<T extends FormatTypes = FormatTypes> extends SetableCriteriaTemplate<"struct"> {
    struct: SetableStruct<T>;
    strict?: boolean;
    optional?: (string | symbol)[] | boolean;
    additional?: SetableCriteriaMap<T>['record'] | boolean;
}
type MountedStruct<T extends SetableStruct> = {
    [K in keyof T]: T[K] extends SetableCriteria ? MountedCriteria<T[K]> : T[K] extends SetableStruct ? MountedCriteria<{
        type: "struct";
        struct: T[K];
    }> : never;
};
interface StructMountedCriteria<T extends StructSetableCriteria> {
    struct: MountedStruct<T['struct']>;
    strict: unknown extends T['strict'] ? true : RecordSetableCriteria['strict'] extends T['strict'] ? boolean : T['strict'];
    optional: unknown extends T['optional'] ? false : StructSetableCriteria['optional'] extends T['optional'] ? (string | symbol)[] | boolean : T['optional'];
    additional: unknown extends T['additional'] ? false : StructSetableCriteria['additional'] extends T['additional'] ? MountedCriteria<RecordSetableCriteria> | boolean : T['additional'] extends RecordSetableCriteria ? MountedCriteria<T['additional']> : T['additional'];
    includedKeySet: Set<string | symbol>;
    unforcedKeySet: Set<string | symbol>;
    requiredKeySet: Set<string | symbol>;
}
type DynamicProperties<U extends RecordSetableCriteria | boolean | undefined> = [
    U
] extends [RecordSetableCriteria] ? GuardedCriteria<U> : [U] extends [false] ? {} : {
    [key: string | symbol]: unknown;
};
type OptionalizeKeys<T, U extends (string | symbol)[] | boolean | undefined> = [
    U
] extends [(string | symbol)[]] ? {
    [K in keyof T as K extends U[number] ? K : never]+?: T[K];
} & {
    [K in keyof T as K extends U[number] ? never : K]-?: T[K];
} : [U] extends [false] ? {
    [P in keyof T]-?: T[P];
} : {
    [P in keyof T]+?: T[P];
};
type StaticProperties<T extends StructSetableCriteria> = {
    -readonly [K in keyof OptionalizeKeys<T['struct'], T['optional']>]: T['struct'][K] extends SetableCriteria ? GuardedCriteria<T['struct'][K]> : never;
};
type StructGuardedCriteria<T extends StructSetableCriteria> = DynamicProperties<T['additional']> extends infer U ? StaticProperties<T> extends infer V ? {
    [K in keyof (U & V)]: K extends keyof V ? V[K] : K extends keyof U ? U[K] : never;
} : never : never;
interface StructDerivedCriteria<T extends StructSetableCriteria> extends DerivedCriteriaTemplate<StructMountedCriteria<T>, StructGuardedCriteria<T>> {
}
type StructErrors = "STRUCT_PROPERTY_REQUIRED" | "STRUCT_PROPERTY_MALFORMED" | "STRUCT_PROPERTY_OBJECT_VALUE_MALFORMED" | "STRICT_PROPERTY_MALFORMED" | "OPTIONAL_PROPERTY_MALFORMED" | "OPTIONAL_PROPERTY_ARRAY_ITEM_MALFORMED" | "ADDITIONAL_PROPERTY_MALFORMED" | "ADDITIONAL_PROPERTY_OBJECT_MISCONFIGURED";
type StringRejects = "TYPE_PLAIN_OBJECT_UNSATISFIED" | "TYPE_OBJECT_UNSATISFIED" | "STRUCT_UNSATISFIED" | "ADDITIONAL_UNALLOWED";
interface StructMembers {
    getUnforcedKeys: (optional: boolean | (string | symbol)[], includedKeys: (string | symbol)[]) => (string | symbol)[];
    getRequiredKeys: (optional: boolean | (string | symbol)[], includedKeys: (string | symbol)[]) => (string | symbol)[];
    isShorthandStruct(obj: {}): obj is SetableStruct;
}

interface ArraySetableCriteria<T extends FormatTypes = FormatTypes> extends SetableCriteriaTemplate<"array"> {
    /** @default true */
    empty?: boolean;
    min?: number;
    max?: number;
    item: SetableCriteria<T>;
}
interface ArrayMountedCriteria<T extends ArraySetableCriteria> {
    item: MountedCriteria<T['item']>;
    empty: unknown extends T['empty'] ? true : ArraySetableCriteria['empty'] extends T['empty'] ? boolean : T['empty'];
}
type ArrayGuardedCriteria<T extends ArraySetableCriteria> = GuardedCriteria<T['item']>[];
interface ArrayDerivedCriteria<T extends ArraySetableCriteria> extends DerivedCriteriaTemplate<ArrayMountedCriteria<T>, ArrayGuardedCriteria<T>> {
}
type ArrayErrors = "ITEM_PROPERTY_REQUIRED" | "ITEM_PROPERTY_MALFORMED" | "EMPTY_PROPERTY_MALFORMED" | "MIN_PROPERTY_MALFORMED" | "MAX_PROPERTY_MALFORMED" | "MIN_AND_MAX_PROPERTIES_MISCONFIGURED";
type ArrayRejects = "TYPE_ARRAY_UNSATISFIED" | "EMPTY_UNALLOWED" | "MIN_UNSATISFIED" | "MAX_UNSATISFIED";

type SetableTuple<T extends FormatTypes = FormatTypes> = [
    SetableCriteria<T> | SetableTuple,
    ...(SetableCriteria<T> | SetableTuple)[]
];
interface TupleSetableCriteria<T extends FormatTypes = FormatTypes> extends SetableCriteriaTemplate<"tuple"> {
    tuple: SetableTuple<T>;
    additional?: SetableCriteriaMap<T>['array'] | boolean;
}
type MountedTuple<T extends SetableTuple> = T extends infer U ? {
    [I in keyof U]: U[I] extends SetableCriteria ? MountedCriteria<U[I]> : U[I] extends SetableTuple ? MountedCriteria<{
        type: "tuple";
        tuple: U[I];
    }> : never;
} : never;
interface TupleMountedCriteria<T extends TupleSetableCriteria> {
    tuple: MountedTuple<T['tuple']>;
    additional: unknown extends T['additional'] ? false : TupleSetableCriteria['additional'] extends T['additional'] ? MountedCriteria<ArraySetableCriteria> | boolean : T['additional'] extends ArraySetableCriteria ? MountedCriteria<T['additional']> : T['additional'];
}
type DynamicItems<U extends ArraySetableCriteria | boolean | undefined> = [
    U
] extends [ArraySetableCriteria] ? GuardedCriteria<U> : [U] extends [false] ? [] : unknown[];
type StaticItems<T extends TupleSetableCriteria> = T['tuple'] extends infer U ? {
    [I in keyof U]: U[I] extends SetableCriteria ? GuardedCriteria<U[I]> : U[I] extends SetableTuple ? GuardedCriteria<{
        type: "tuple";
        tuple: U[I];
    }> : never;
} : never;
type TupleGuardedCriteria<T extends TupleSetableCriteria> = DynamicItems<T['additional']> extends infer U ? StaticItems<T> extends infer V ? U extends any[] ? V extends any[] ? [...V, ...U] : never : never : never : never;
interface TupleDerivedCriteria<T extends TupleSetableCriteria> extends DerivedCriteriaTemplate<TupleMountedCriteria<T>, TupleGuardedCriteria<T>> {
}
type TupleErrors = "TUPLE_PROPERTY_REQUIRED" | "TUPLE_PROPERTY_MALFORMED" | "TUPLE_PROPERTY_ARRAY_ITEM_MALFORMED" | "ADDITIONAL_PROPERTY_MALFORMED" | "ADDITIONAL_PROPERTY_OBJECT_MISCONFIGURED";
type TupleRejects = "TYPE_ARRAY_UNSATISFIED" | "TUPLE_UNSATISFIED" | "ADDITIONAL_UNALLOWED";
interface TupleMembers {
    isShorthandTuple(obj: {}): obj is SetableTuple;
}

type SetableUnion<T extends FormatTypes = FormatTypes> = [
    SetableCriteria<T>,
    SetableCriteria<T>,
    ...SetableCriteria<T>[]
];
interface UnionSetableCriteria<T extends FormatTypes = FormatTypes> extends SetableCriteriaTemplate<"union"> {
    union: SetableUnion<T>;
}
type MountedUnion<T extends SetableUnion> = T extends infer U ? {
    [I in keyof U]: U[I] extends SetableCriteria ? MountedCriteria<U[I]> : never;
} : never;
interface UnionMountedCriteria<T extends UnionSetableCriteria> {
    union: MountedUnion<T['union']>;
}
type UnionGuardedCriteria<T extends UnionSetableCriteria> = T['union'] extends infer U ? {
    [I in keyof U]: U[I] extends SetableCriteria ? GuardedCriteria<U[I]> : never;
}[any] : never;
interface UnionDerivedCriteria<T extends UnionSetableCriteria> extends DerivedCriteriaTemplate<UnionMountedCriteria<T>, UnionGuardedCriteria<T>> {
}
type UnionErrors = "UNION_PROPERTY_REQUIRED" | "UNION_PROPERTY_MALFORMED" | "UNION_PROPERTY_ARRAY_ITEM_MALFORMED";

declare const formatNatives: ({
    type: "boolean";
    errors: {};
    mount?(chunk: MounterChunk, criteria: BooleanSetableCriteria): null;
    check(chunk: CheckerChunk, criteria: Omit<BooleanSetableCriteria, never> & GlobalMountedCriteria, value: unknown): "TYPE_BOOLEAN_UNSATISFIED" | null;
} | {
    type: "symbol";
    errors: {
        SYMBOL_PROPERTY_MALFORMED: string;
    };
    mount?(chunk: MounterChunk, criteria: SymbolSetableCriteria): "SYMBOL_PROPERTY_MALFORMED" | null;
    check(chunk: CheckerChunk, criteria: Omit<SymbolSetableCriteria, never> & GlobalMountedCriteria, value: unknown): SymbolRejects | null;
} | {
    type: "number";
    errors: {
        MIN_PROPERTY_MALFORMED: string;
        MAX_PROPERTY_MALFORMED: string;
        MIN_AND_MAX_PROPERTIES_MISCONFIGURED: string;
        ENUM_PROPERTY_MALFORMED: string;
        ENUM_PROPERTY_ARRAY_ITEM_MALFORMED: string;
        ENUM_PROPERTY_OBJECT_KEY_MALFORMED: string;
        ENUM_PROPERTY_OBJECT_VALUE_MALFORMED: string;
        CUSTOM_PROPERTY_MALFORMED: string;
    };
    mount?(chunk: MounterChunk, criteria: NumberSetableCriteria): NumberErrors | null;
    check(chunk: CheckerChunk, criteria: Omit<NumberSetableCriteria, never> & GlobalMountedCriteria, value: unknown): NumberRejects | null;
} | Format<StringSetableCriteria, StringErrors, StringRejects$1, StringMembers> | Format<SimpleSetableCriteria, SimpleErrors, SimpleRejects, SimpleMembers> | {
    type: "record";
    errors: {
        MIN_PROPERTY_MALFORMED: string;
        MAX_PROPERTY_MALFORMED: string;
        MIN_AND_MAX_PROPERTIES_MISCONFIGURED: string;
        EMPTY_PROPERTY_MALFORMED: string;
        KEY_PROPERTY_REQUIRED: string;
        KEY_PROPERTY_MALFORMED: string;
        VALUE_PROPERTY_REQUIRED: string;
        VALUE_PROPERTY_MALFORMED: string;
        STRICT_PROPERTY_MALFORMED: string;
    };
    mount?(chunk: MounterChunk, criteria: RecordSetableCriteria<keyof SetableCriteriaMap<any>>): RecordErrors | null;
    check(chunk: CheckerChunk, criteria: Omit<RecordSetableCriteria<keyof SetableCriteriaMap<any>>, keyof RecordMountedCriteria<RecordSetableCriteria<keyof SetableCriteriaMap<any>>>> & RecordMountedCriteria<RecordSetableCriteria<keyof SetableCriteriaMap<any>>> & GlobalMountedCriteria, value: unknown): RecordRejects | null;
} | Format<StructSetableCriteria<keyof SetableCriteriaMap<any>>, StructErrors, StringRejects, StructMembers> | {
    type: "array";
    errors: {
        MIN_PROPERTY_MALFORMED: string;
        MAX_PROPERTY_MALFORMED: string;
        MIN_AND_MAX_PROPERTIES_MISCONFIGURED: string;
        EMPTY_PROPERTY_MALFORMED: string;
        ITEM_PROPERTY_REQUIRED: string;
        ITEM_PROPERTY_MALFORMED: string;
    };
    mount?(chunk: MounterChunk, criteria: ArraySetableCriteria<keyof SetableCriteriaMap<any>>): ArrayErrors | null;
    check(chunk: CheckerChunk, criteria: Omit<ArraySetableCriteria<keyof SetableCriteriaMap<any>>, keyof ArrayMountedCriteria<ArraySetableCriteria<keyof SetableCriteriaMap<any>>>> & ArrayMountedCriteria<ArraySetableCriteria<keyof SetableCriteriaMap<any>>> & GlobalMountedCriteria, value: unknown): ArrayRejects | null;
} | Format<TupleSetableCriteria<keyof SetableCriteriaMap<any>>, TupleErrors, TupleRejects, TupleMembers> | {
    type: "union";
    errors: {
        UNION_PROPERTY_REQUIRED: string;
        UNION_PROPERTY_MALFORMED: string;
        UNION_PROPERTY_ARRAY_ITEM_MALFORMED: string;
    };
    mount?(chunk: MounterChunk, criteria: UnionSetableCriteria<keyof SetableCriteriaMap<any>>): UnionErrors | null;
    check(chunk: CheckerChunk, criteria: Omit<UnionSetableCriteria<keyof SetableCriteriaMap<any>>, "union"> & UnionMountedCriteria<UnionSetableCriteria<keyof SetableCriteriaMap<any>>> & GlobalMountedCriteria, value: unknown): string | null;
})[];

/**
 * Defines the criteria users must or can specify.
 *
 * @template T The name assigned to the format when the user selects the type.
 */
interface SetableCriteriaTemplate<T extends string> {
    type: T;
    label?: string;
    message?: string;
    nullish?: boolean;
}
interface SetableCriteriaMap<T extends keyof SetableCriteriaMap = any> {
    boolean: BooleanSetableCriteria;
    symbol: SymbolSetableCriteria;
    number: NumberSetableCriteria;
    string: StringSetableCriteria;
    simple: SimpleSetableCriteria;
    record: RecordSetableCriteria<T>;
    struct: StructSetableCriteria<T>;
    array: ArraySetableCriteria<T>;
    tuple: TupleSetableCriteria<T>;
    union: UnionSetableCriteria<T>;
}
type FormatTypes = keyof SetableCriteriaMap;
/**
 * @template Mounted A type that takes a generic parameter extending
 * 'SetableCriteria'. It is used to determine the type validated
 * by the format it represents, based on the criteria defined
 * by the user.
 *
 * @template Guarded Properties that will be added to or override
 * the format criteria after the mounting process.
 */
interface DerivedCriteriaTemplate<Mounted, Guarded> {
    mounted: Mounted;
    guarded: Guarded;
}
interface DerivedCriteriaMap<T extends SetableCriteria = SetableCriteria> {
    boolean: T extends BooleanSetableCriteria ? BooleanDerivedCriteria : never;
    symbol: T extends SymbolSetableCriteria ? SymbolDerivedCriteria : never;
    number: T extends NumberSetableCriteria ? NumberDerivedCriteria<T> : never;
    string: T extends StringSetableCriteria ? StringDerivedCriteria<T> : never;
    simple: T extends SimpleSetableCriteria ? SimpleDerivedCriteria<T> : never;
    record: T extends RecordSetableCriteria ? RecordDerivedCriteria<T> : never;
    struct: T extends StructSetableCriteria ? StructDerivedCriteria<T> : never;
    array: T extends ArraySetableCriteria ? ArrayDerivedCriteria<T> : never;
    tuple: T extends TupleSetableCriteria ? TupleDerivedCriteria<T> : never;
    union: T extends UnionSetableCriteria ? UnionDerivedCriteria<T> : never;
}
type SetableCriteria<T extends FormatTypes = FormatTypes> = SetableCriteriaMap<T>[T];
interface GlobalMountedCriteria {
    [nodeSymbol]: {
        partPaths: NodePaths;
        childNodes: Set<MountedCriteria>;
    };
}
type MountedCriteria<T extends SetableCriteria = SetableCriteria> = T extends any ? T extends {
    [nodeSymbol]: any;
} ? T : (Omit<T, keyof DerivedCriteriaMap<T>[T['type']]['mounted']> & DerivedCriteriaMap<T>[T['type']]['mounted'] & GlobalMountedCriteria) : never;
type GuardedCriteria<T extends SetableCriteria = SetableCriteria> = T['nullish'] extends true ? DerivedCriteriaMap<T>[T['type']]['guarded'] | undefined | null : DerivedCriteriaMap<T>[T['type']]['guarded'];
/**
 * @template T Extended interface of `SettableCriteriaTemplate` that
 * defines the format criteria users must or can specify.
 * @template E Error codes you want to use in the format.
 * @template M Custom members you want to add to the format.
 */
type Format<T extends SetableCriteria = SetableCriteria, E extends string = string, R extends string = string, M extends {} = {}> = {
    type: T['type'];
    errors: {
        [K in E]: string;
    };
    mount?(chunk: MounterChunk, criteria: T): E | null;
    check(chunk: CheckerChunk, criteria: MountedCriteria<T>, value: unknown): R | null;
} & M;
type FormatNativeTypes = (typeof formatNatives)[number]['type'];

declare class FormatsManager {
    private store;
    constructor();
    add(formats: Format[]): void;
    get(type: FormatTypes): Format;
}

interface Events {
    "NODE_MOUNTED": (node: MountedCriteria, path: NodePaths) => void;
    "TREE_MOUNTED": (rootNode: MountedCriteria) => void;
    "DATA_CHECKED": (rootNode: MountedCriteria, rootData: unknown, reject: CheckerReject | null) => void;
}

declare class EventsManager {
    listeners: Map<keyof Events, ((...args: any[]) => any)[]>;
    constructor();
    on<K extends keyof Events>(event: K, callback: Events[K]): void;
    emit<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>): void;
    off<K extends keyof Events>(event: K, callback: Events[K]): void;
}

/**
 * The `Schema` class is used to define and validate data structures,
 * ensuring they conform to specified criteria.
 */
declare class Schema<const T extends SetableCriteria = SetableCriteria<FormatNativeTypes>> {
    private mountedCriteria;
    protected managers: {
        formats: FormatsManager;
        events: EventsManager;
    };
    protected initiate(criteria: T): void;
    constructor(criteria: T);
    /**
     * Properties representing the root of the mounted criteria,
     * which can be used in other schemas.
     */
    get criteria(): MountedCriteria<T>;
    /**
     * Validates the provided data against the schema.
     *
     * @param data - The data to be validated.
     *
     * @returns `true` if the value is **valid**, otherwise `false`.
     * This function acts as a **type guard**, ensuring that
     * the validated data conforms to `GuardedCriteria<T>`.
     */
    validate(data: unknown): data is GuardedCriteria<MountedCriteria<T>>;
    /**
     * Evaluates the provided data against the schema.
     *
     * @param data - The data to be evaluated.
     */
    evaluate(data: unknown): SchemaEvaluate<T>;
}

type SchemaEvaluate<T extends SetableCriteria> = {
    reject: CheckerReject;
    data: null;
} | {
    reject: null;
    data: GuardedCriteria<MountedCriteria<T>>;
};
type SchemaInfer<T> = T extends Schema<infer U> ? GuardedCriteria<MountedCriteria<U>> : never;
type SchemaInstance<T extends SetableCriteria = SetableCriteria> = InstanceType<typeof Schema<T>>;
type SchemaParameters<T extends SetableCriteria = SetableCriteria> = ConstructorParameters<typeof Schema<T>>;
interface SchemaPlugin {
    formats: Format[];
    [key: string | symbol]: any;
}

type MixinPluginsCriteria<P1C, P1M extends SchemaPlugin, P2C, P2M extends SchemaPlugin, P3C, P3M extends SchemaPlugin> = (P1C extends SetableCriteria ? P2C extends SetableCriteria ? P3C extends SetableCriteria ? SetableCriteria extends P3C ? P1C | P2C | P3C : SetableCriteria<(P1M['formats'] | P2M['formats'] | P3M['formats'])[number]['type'] | FormatNativeTypes> : SetableCriteria extends P2C ? P1C | P2C : SetableCriteria<(P1M['formats'] | P2M['formats'])[number]['type'] | FormatNativeTypes> : SetableCriteria extends P1C ? P1C : SetableCriteria<P1M['formats'][number]['type'] | FormatNativeTypes> : never);
type MixinSchemaPlugin<P1C, P1M extends SchemaPlugin, P2C, P2M extends SchemaPlugin, P3C, P3M extends SchemaPlugin> = P1C extends SetableCriteria ? P2C extends SetableCriteria ? P3C extends SetableCriteria ? SchemaInstance<P1C & P2C & P3C> & P1M & P2M & P3M : SchemaInstance<P1C & P2C> & P1M & P2M : SchemaInstance<P1C> & P1M : never;
type MixinPlugins<P1C, P1M extends SchemaPlugin, P2C, P2M extends SchemaPlugin, P3C, P3M extends SchemaPlugin> = new (...args: [MixinPluginsCriteria<P1C, P1M, P2C, P2M, P3C, P3M>]) => Omit<MixinSchemaPlugin<P1C, P1M, P2C, P2M, P3C, P3M>, "formats">;
declare function SchemaFactory<P1C extends SetableCriteria, P1M extends SchemaPlugin, P2C = unknown, P2M extends SchemaPlugin = never, P3C = unknown, P3M extends SchemaPlugin = never>(plugin1: (...args: [P1C]) => P1M, plugin2?: (...args: [P2C]) => P2M, plugin3?: (...args: [P3C]) => P3M): MixinPlugins<P1C, P1M, P2C, P2M, P3C, P3M>;

interface SchemaNodeErrorContext {
    node: SetableCriteria;
    type: FormatTypes;
    path: NodePaths;
    code: string;
    message: string;
}
declare class SchemaNodeError extends Error {
    node: SetableCriteria;
    type: FormatTypes;
    path: NodePaths;
    code: string;
    message: string;
    constructor(context: SchemaNodeErrorContext);
}

type InternalTags = "Undefined" | "Boolean" | "String" | "Function" | "Promise" | "Array" | "ArrayBuffer" | "SharedArrayBuffer" | "Int8Array" | "Int16Array" | "Int32Array" | "Uint8Array" | "Uint8ClampedArray" | "Uint16Array" | "Uint32Array" | "Float32Array" | "Float64Array" | "BigInt64Array" | "BigUint64Array" | "DataView" | "Map" | "Set" | "WeakMap" | "WeakSet" | "WeakRef" | "Proxy" | "RegExp" | "Error" | "Date" | "FinalizationRegistry" | "BigInt" | "Symbol" | "Iterator" | "AsyncFunction" | "GeneratorFunction" | "AsyncGeneratorFunction" | "Atomics" | "JSON" | "Math" | "Reflect" | "Null" | "Number" | "Generator" | "AsyncGenerator" | "Object" | "Intl.Collator" | "Intl.DateTimeFormat" | "Intl.ListFormat" | "Intl.NumberFormat" | "Intl.PluralRules" | "Intl.RelativeTimeFormat" | "Intl.Locale";

declare function getInternalTag(target: unknown): LooseAutocomplete<InternalTags>;

declare const objectHelpers_getInternalTag: typeof getInternalTag;
declare namespace objectHelpers {
  export {
    objectHelpers_getInternalTag as getInternalTag,
  };
}

declare function base16ToBase64(input: string, to?: "B64" | "B64URL", padding?: boolean): string;
declare function base16ToBase32(input: string, to?: "B16" | "B16HEX", padding?: boolean): string;
declare function base64ToBase16(input: string, from?: "B64" | "B64URL"): string;
declare function base32ToBase16(input: string, from?: "B16" | "B16HEX"): string;

declare const stringHelpers_base16ToBase32: typeof base16ToBase32;
declare const stringHelpers_base16ToBase64: typeof base16ToBase64;
declare const stringHelpers_base32ToBase16: typeof base32ToBase16;
declare const stringHelpers_base64ToBase16: typeof base64ToBase16;
declare namespace stringHelpers {
  export {
    stringHelpers_base16ToBase32 as base16ToBase32,
    stringHelpers_base16ToBase64 as base16ToBase64,
    stringHelpers_base32ToBase16 as base32ToBase16,
    stringHelpers_base64ToBase16 as base64ToBase16,
  };
}

declare const helpers: {
    object: typeof objectHelpers;
    string: typeof stringHelpers;
};

declare class Issue extends Error {
    constructor(context: string, message: string, stack?: string, plugin?: string);
    toString(): string;
}

export { Issue, Schema, SchemaFactory, SchemaNodeError, base16ToBase32, base16ToBase64, base32ToBase16, base64ToBase16, getInternalTag, helpers, isArray, isAscii, isAsyncFunction, isAsyncGeneratorFunction, isBase16, isBase32, isBase32Hex, isBase64, isBase64Url, isDataUrl, isDomain, isEmail, isFunction, isGeneratorFunction, isIp, isIpV4, isIpV6, isObject, isPlainObject, isTypedArray, isUuid, testers };
export type { AsyncFunction, BasicArray, BasicFunction, BasicObject, DerivedCriteriaTemplate, Format, FormatNativeTypes, FormatTypes, GuardedCriteria, InternalTags, MountedCriteria, PlainObject, SchemaInfer, SchemaInstance, SchemaParameters, SchemaPlugin, SetableCriteria, SetableCriteriaTemplate, TypedArray };
