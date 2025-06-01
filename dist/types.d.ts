interface BooleanSetableCriteria extends SetableCriteriaTemplate<"boolean"> {
}
interface BooleanSpecTypes extends SpecTypesTemplate<BooleanSetableCriteria, {}> {
}
interface BooleanFlowTypes extends FlowTypesTemplate<{}, boolean> {
}

interface SymbolSetableCriteria extends SetableCriteriaTemplate<"symbol"> {
    symbol?: symbol;
}
interface SymbolSpecTypes extends SpecTypesTemplate<SymbolSetableCriteria, {}> {
}
interface SymbolFlowTypes extends FlowTypesTemplate<{}, symbol> {
}

interface NumberSetableCriteria extends SetableCriteriaTemplate<"number"> {
    /** @default true */
    empty?: boolean;
    min?: number;
    max?: number;
    enum?: number[] | Record<string | number, number>;
    custom?: (input: number) => boolean;
}
interface NumberDefaultCriteria {
    empty: boolean;
}
interface NumberSpecTypes extends SpecTypesTemplate<NumberSetableCriteria, NumberDefaultCriteria> {
}
type NumberGuardedCriteria<T extends NumberSetableCriteria> = T['enum'] extends number[] ? T['enum'][number] : T['enum'] extends Record<string | number, number> ? T['enum'][keyof T['enum']] : number;
interface NumberFlowTypes<T extends NumberSetableCriteria> extends FlowTypesTemplate<{}, NumberGuardedCriteria<T>> {
}

type PlainObject = Record<string | symbol, unknown>;
type PlainFunction = (...args: unknown[]) => unknown;
type AsyncFunction = (...args: unknown[]) => Promise<unknown>;

declare function isObject(x: unknown): x is object;
/**
 * A plain object is considered as follows:
 * - It must be an object.
 * - It must have a prototype of `Object.prototype` or `null`.
*/
declare function isPlainObject(x: unknown): x is PlainObject;
declare function isArray(x: unknown): x is unknown[];
declare function isTypedArray(x: unknown): x is unknown[];
declare function isFunction(x: unknown): x is Function;
/**
 * A basic function is considered as follows:
 * - It must be an function.
 * - It must not be an `async`, `generator` or `async generator` function.
*/
declare function isBasicFunction(x: unknown): x is PlainFunction;
declare function isAsyncFunction(x: unknown): x is AsyncFunction;
declare function isGeneratorFunction(x: unknown): x is GeneratorFunction;
declare function isAsyncGeneratorFunction(x: unknown): x is AsyncGeneratorFunction;

declare const objectTesters_isArray: typeof isArray;
declare const objectTesters_isAsyncFunction: typeof isAsyncFunction;
declare const objectTesters_isAsyncGeneratorFunction: typeof isAsyncGeneratorFunction;
declare const objectTesters_isBasicFunction: typeof isBasicFunction;
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
    objectTesters_isBasicFunction as isBasicFunction,
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
 * @see https://datatracker.ietf.org/doc/html/rfc9562#section-4
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

type ExtractParams<T extends (input: any, params: any) => any> = T extends (input: any, params: infer U) => any ? U : never;
type StringTests = typeof testers.string;
type SetableTests = {
    [K in keyof StringTests]: ExtractParams<StringTests[K]> | true;
};
interface StringSetableCriteria extends SetableCriteriaTemplate<"string"> {
    /** @default true */
    empty?: boolean;
    min?: number;
    max?: number;
    enum?: string[] | Record<string | number, string>;
    tests?: SetableTests;
    regex?: RegExp;
    custom?: (value: string) => boolean;
}
interface StringDefaultCriteria {
    empty: boolean;
}
interface StringSpecTypes extends SpecTypesTemplate<StringSetableCriteria, StringDefaultCriteria> {
}
type StringGuardedCriteria<T extends StringSetableCriteria> = T['enum'] extends string[] ? T['empty'] extends true ? T['enum'][number] | "" : T['enum'][number] : T['enum'] extends Record<string | number, string> ? T['empty'] extends true ? {
    [K in keyof T['enum']]: T['enum'][K];
}[keyof T['enum']] | "" : {
    [K in keyof T['enum']]: T['enum'][K];
}[keyof T['enum']] : string;
interface StringFlowTypes<T extends StringSetableCriteria> extends FlowTypesTemplate<{}, StringGuardedCriteria<T>> {
}

type SimpleTypes = "undefined" | "nullish" | "null" | "unknown" | "any";
interface SimpleSetableCriteria extends SetableCriteriaTemplate<"simple"> {
    simple: SimpleTypes;
}
interface SimpleSpecTypes extends SpecTypesTemplate<SimpleSetableCriteria, {}> {
}
interface SimpleMountedCriteria {
    bitcode: number;
}
type SimpleGuardedCriteria<T extends SimpleSetableCriteria> = T["simple"] extends "nullish" ? undefined | null : T["simple"] extends "undefined" ? undefined : T["simple"] extends "null" ? null : T["simple"] extends "unknown" ? unknown : T["simple"] extends "any" ? any : never;
interface SimpleFlowTypes<T extends SimpleSetableCriteria> extends FlowTypesTemplate<SimpleMountedCriteria, SimpleGuardedCriteria<T>> {
}

type SetableKey = SetableCriteria<"string" | "symbol">;
interface RecordSetableCriteria<T extends FormatNames = FormatNames> extends SetableCriteriaTemplate<"record"> {
    /** @default true */
    empty?: boolean;
    min?: number;
    max?: number;
    key: SetableKey;
    value: SetableCriteria<T>;
}
interface RecordDefaultCriteria {
    empty: boolean;
}
interface RecordSpecTypes<T extends FormatNames> extends SpecTypesTemplate<RecordSetableCriteria<T>, RecordDefaultCriteria> {
}
interface RecordMountedCriteria<T extends RecordSetableCriteria> {
    key: MountedCriteria<T['key']>;
    value: MountedCriteria<T['value']>;
}
type RecordGuardedCriteria<T extends RecordSetableCriteria> = GuardedCriteria<T['key']> extends infer U ? U extends PropertyKey ? {
    [P in U]: GuardedCriteria<T['value']>;
} : never : never;
interface RecordFlowTypes<T extends RecordSetableCriteria> extends FlowTypesTemplate<RecordMountedCriteria<T>, RecordGuardedCriteria<T>> {
}

type SetableStruct<T extends FormatNames = FormatNames> = {
    [key: string | symbol]: SetableCriteria<T> | SetableStruct<T>;
};
interface StructSetableCriteria<T extends FormatNames = FormatNames> extends SetableCriteriaTemplate<"struct"> {
    struct: SetableStruct<T>;
    optional?: (string | symbol)[];
}
interface StructSpecTypes<T extends FormatNames> extends SpecTypesTemplate<StructSetableCriteria<T>, {}> {
}
type MountedStruct<T extends SetableStruct> = {
    [K in keyof T]: T[K] extends SetableCriteria ? MountedCriteria<T[K]> : T[K] extends SetableStruct ? MountedCriteria<{
        type: "struct";
        struct: T[K];
    }> : never;
};
interface StructMountedCriteria<T extends StructSetableCriteria> {
    struct: MountedStruct<T['struct']>;
    acceptedKeys: Set<string | symbol>;
    requiredKeys: Set<string | symbol>;
}
type OptionalizeKeys<T, K extends PropertyKey[] | undefined> = K extends PropertyKey[] ? {
    [P in keyof T as P extends K[number] ? P : never]+?: T[P];
} & {
    [P in keyof T as P extends K[number] ? never : P]-?: T[P];
} : T;
type StructGuardedCriteria<T extends StructSetableCriteria> = {
    -readonly [K in keyof OptionalizeKeys<T['struct'], T['optional']>]: T['struct'][K] extends SetableCriteria ? GuardedCriteria<T['struct'][K]> : T['struct'][K] extends SetableStruct ? GuardedCriteria<{
        type: "struct";
        struct: T['struct'][K];
    }> : never;
} extends infer R ? R : never;
interface StructFlowTypes<T extends StructSetableCriteria> extends FlowTypesTemplate<StructMountedCriteria<T>, StructGuardedCriteria<T>> {
}

interface ArraySetableCriteria<T extends FormatNames = FormatNames> extends SetableCriteriaTemplate<"array"> {
    /** @default true */
    empty?: boolean;
    min?: number;
    max?: number;
    item: SetableCriteria<T>;
}
interface ArrayDefaultCriteria {
    empty: boolean;
}
interface ArraySpecTypes<T extends FormatNames> extends SpecTypesTemplate<ArraySetableCriteria<T>, ArrayDefaultCriteria> {
}
interface ArrayMountedCriteria<T extends ArraySetableCriteria> {
    item: MountedCriteria<T['item']>;
}
type ArrayGuardedCriteria<T extends ArraySetableCriteria> = GuardedCriteria<T['item']>[];
interface ArrayFlowTypes<T extends ArraySetableCriteria> extends FlowTypesTemplate<ArrayMountedCriteria<T>, ArrayGuardedCriteria<T>> {
}

type SetableTuple<T extends FormatNames = FormatNames> = [
    SetableCriteria<T> | SetableTuple,
    ...(SetableCriteria<T> | SetableTuple)[]
];
interface TupleSetableCriteria<T extends FormatNames = FormatNames> extends SetableCriteriaTemplate<"tuple"> {
    tuple: SetableTuple<T>;
}
interface TupleSpecTypes<T extends FormatNames> extends SpecTypesTemplate<TupleSetableCriteria<T>, {}> {
}
type MountedTuple<T extends SetableTuple> = T extends infer U ? {
    [I in keyof U]: U[I] extends SetableCriteria ? MountedCriteria<U[I]> : U[I] extends SetableTuple ? MountedCriteria<{
        type: "tuple";
        tuple: U[I];
    }> : never;
} : never;
interface TupleMountedCriteria<T extends TupleSetableCriteria> {
    tuple: MountedTuple<T['tuple']>;
}
type TupleGuardedCriteria<T extends TupleSetableCriteria> = T['tuple'] extends infer U ? {
    [I in keyof U]: U[I] extends SetableCriteria ? GuardedCriteria<U[I]> : U[I] extends SetableTuple ? GuardedCriteria<{
        type: "tuple";
        tuple: U[I];
    }> : never;
} : never;
interface TupleFlowTypes<T extends TupleSetableCriteria> extends FlowTypesTemplate<TupleMountedCriteria<T>, TupleGuardedCriteria<T>> {
}

type SetableUnion<T extends FormatNames = FormatNames> = [
    SetableCriteria<T>,
    SetableCriteria<T>,
    ...SetableCriteria<T>[]
];
interface UnionSetableCriteria<T extends FormatNames = FormatNames> extends SetableCriteriaTemplate<"union"> {
    union: SetableUnion<T>;
}
interface UnionSpecTypes<T extends FormatNames> extends SpecTypesTemplate<UnionSetableCriteria<T>, {}> {
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
interface UnionFlowTypes<T extends UnionSetableCriteria> extends FlowTypesTemplate<UnionMountedCriteria<T>, UnionGuardedCriteria<T>> {
}

type LooseAutocomplete<T extends string> = T | Omit<string, T>;

interface PathSegments {
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
type MountingChunk = {
    node: SetableCriteria | MountedCriteria;
    partPaths: PathSegments;
}[];
interface CheckingHooks {
    owner: CheckingTask;
    index: {
        chunk: number;
        branch: number;
    };
    onAccept(): {
        action: "DEFAULT";
    } | {
        action: "IGNORE";
        target: "CHUNK";
    } | {
        action: "REJECT";
        code: string;
    };
    onReject(reject: CheckingReject): {
        action: "DEFAULT";
    } | {
        action: "IGNORE";
        target: "CHUNK" | "BRANCH";
    } | {
        action: "REJECT";
        code: string;
    };
}
interface CheckingTask {
    data: unknown;
    node: MountedCriteria;
    fullPaths: PathSegments;
    stackHooks?: CheckingHooks[];
}
interface CheckingChunkTask {
    data: CheckingTask['data'];
    node: CheckingTask['node'];
    hooks?: Omit<CheckingHooks, "owner" | "index">;
}
type CheckingChunk = CheckingChunkTask[];
interface CheckingReject {
    path: PathSegments;
    /**
     * Error code structured as `<CATEGORY>_<DETAIL>`, where `<CATEGORY>` can be:
     *
     * - `TYPE`: Indicates an error related to a data type (e.g., `TYPE_STRING_REQUIRED`).
     * - `DATA`: Indicates an error related to the provided data (e.g., `DATA_KEYS_MISSING`).
     * - `TEST`: Indicates an error related to a specific test or validation (e.g., `TEST_REGEX_FAILED`).
     *
     * `<DETAIL>`: A specific description of the error, such as `STRING_REQUIRED`, `KEYS_MISSING`, etc.
     */
    code: string;
    type: string;
    label: string | undefined;
    message: string | undefined;
}

declare const nodeSymbol: unique symbol;

interface CustomProperties {
    bitflags: Record<SimpleTypes, number>;
}

declare const formatNatives: ({
    type: "boolean";
    defaultCriteria: {};
    mount?(chunk: MountingChunk, criteria: BooleanSetableCriteria): void;
    check(chunk: CheckingChunk, criteria: Omit<BooleanSetableCriteria, never> & StaticMountedCriteria, value: unknown): CheckingReject["code"] | null;
} | {
    type: "symbol";
    defaultCriteria: {};
    mount?(chunk: MountingChunk, criteria: SymbolSetableCriteria): void;
    check(chunk: CheckingChunk, criteria: Omit<SymbolSetableCriteria, never> & StaticMountedCriteria, value: unknown): CheckingReject["code"] | null;
} | {
    type: "number";
    defaultCriteria: NumberDefaultCriteria;
    mount?(chunk: MountingChunk, criteria: NumberSetableCriteria): void;
    check(chunk: CheckingChunk, criteria: NumberDefaultCriteria & Omit<NumberSetableCriteria, never> & StaticMountedCriteria, value: unknown): CheckingReject["code"] | null;
} | {
    type: "string";
    defaultCriteria: StringDefaultCriteria;
    mount?(chunk: MountingChunk, criteria: StringSetableCriteria): void;
    check(chunk: CheckingChunk, criteria: StringDefaultCriteria & Omit<StringSetableCriteria, never> & StaticMountedCriteria, value: unknown): CheckingReject["code"] | null;
} | Format<SimpleSetableCriteria, CustomProperties> | {
    type: "record";
    defaultCriteria: RecordDefaultCriteria;
    mount?(chunk: MountingChunk, criteria: RecordSetableCriteria<keyof FormatSpecTypes<any>>): void;
    check(chunk: CheckingChunk, criteria: RecordDefaultCriteria & Omit<RecordSetableCriteria<keyof FormatSpecTypes<any>>, keyof RecordMountedCriteria<RecordSetableCriteria<keyof FormatSpecTypes<any>>>> & RecordMountedCriteria<RecordSetableCriteria<keyof FormatSpecTypes<any>>> & StaticMountedCriteria, value: unknown): CheckingReject["code"] | null;
} | {
    type: "struct";
    defaultCriteria: {};
    mount?(chunk: MountingChunk, criteria: StructSetableCriteria<keyof FormatSpecTypes<any>>): void;
    check(chunk: CheckingChunk, criteria: Omit<StructSetableCriteria<keyof FormatSpecTypes<any>>, keyof StructMountedCriteria<StructSetableCriteria<keyof FormatSpecTypes<any>>>> & StructMountedCriteria<StructSetableCriteria<keyof FormatSpecTypes<any>>> & StaticMountedCriteria, value: unknown): CheckingReject["code"] | null;
} | {
    type: "array";
    defaultCriteria: ArrayDefaultCriteria;
    mount?(chunk: MountingChunk, criteria: ArraySetableCriteria<keyof FormatSpecTypes<any>>): void;
    check(chunk: CheckingChunk, criteria: ArrayDefaultCriteria & Omit<ArraySetableCriteria<keyof FormatSpecTypes<any>>, "item"> & ArrayMountedCriteria<ArraySetableCriteria<keyof FormatSpecTypes<any>>> & StaticMountedCriteria, value: unknown): CheckingReject["code"] | null;
} | {
    type: "tuple";
    defaultCriteria: {};
    mount?(chunk: MountingChunk, criteria: TupleSetableCriteria<keyof FormatSpecTypes<any>>): void;
    check(chunk: CheckingChunk, criteria: Omit<TupleSetableCriteria<keyof FormatSpecTypes<any>>, "tuple"> & TupleMountedCriteria<TupleSetableCriteria<keyof FormatSpecTypes<any>>> & StaticMountedCriteria, value: unknown): CheckingReject["code"] | null;
} | {
    type: "union";
    defaultCriteria: {};
    mount?(chunk: MountingChunk, criteria: UnionSetableCriteria<keyof FormatSpecTypes<any>>): void;
    check(chunk: CheckingChunk, criteria: Omit<UnionSetableCriteria<keyof FormatSpecTypes<any>>, "union"> & UnionMountedCriteria<UnionSetableCriteria<keyof FormatSpecTypes<any>>> & StaticMountedCriteria, value: unknown): CheckingReject["code"] | null;
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
/**
 * @template T Extended interface of `SetableCriteriaTemplate` that
 * defines the format criteria users must or can specify.
 *
 * @template U Default properties for those defined in `T` that must
 * be specified in the superclass reference within the format class.
 */
interface SpecTypesTemplate<Setable extends SetableCriteriaTemplate<string>, Default extends Partial<Setable>> {
    setableCriteria: Setable;
    defaultCriteria: Default;
}
interface FormatSpecTypes<T extends keyof FormatSpecTypes = any> {
    boolean: BooleanSpecTypes;
    symbol: SymbolSpecTypes;
    number: NumberSpecTypes;
    string: StringSpecTypes;
    simple: SimpleSpecTypes;
    record: RecordSpecTypes<T>;
    struct: StructSpecTypes<T>;
    array: ArraySpecTypes<T>;
    tuple: TupleSpecTypes<T>;
    union: UnionSpecTypes<T>;
}
type FormatNames = keyof FormatSpecTypes;
/**
 * @template Mounted A type that takes a generic parameter extending
 * 'SetableCriteria'. It is used to determine the type validated
 * by the format it represents, based on the criteria defined
 * by the user.
 *
 * @template Guarded Properties that will be added to or override
 * the format criteria after the mounting process.
 */
interface FlowTypesTemplate<Mounted, Guarded> {
    mountedCriteria: Mounted;
    guardedCriteria: Guarded;
}
interface FormatFlowTypes<T extends SetableCriteria = SetableCriteria> {
    boolean: T extends BooleanSetableCriteria ? BooleanFlowTypes : never;
    symbol: T extends SymbolSetableCriteria ? SymbolFlowTypes : never;
    number: T extends NumberSetableCriteria ? NumberFlowTypes<T> : never;
    string: T extends StringSetableCriteria ? StringFlowTypes<T> : never;
    simple: T extends SimpleSetableCriteria ? SimpleFlowTypes<T> : never;
    record: T extends RecordSetableCriteria ? RecordFlowTypes<T> : never;
    struct: T extends StructSetableCriteria ? StructFlowTypes<T> : never;
    array: T extends ArraySetableCriteria ? ArrayFlowTypes<T> : never;
    tuple: T extends TupleSetableCriteria ? TupleFlowTypes<T> : never;
    union: T extends UnionSetableCriteria ? UnionFlowTypes<T> : never;
}
type SetableCriteria<T extends FormatNames = FormatNames> = FormatSpecTypes<T>[T]['setableCriteria'];
interface StaticMountedCriteria {
    [nodeSymbol]: {
        partPaths: PathSegments;
        childNodes: Set<MountedCriteria>;
    };
}
type MountedCriteria<T extends SetableCriteria = SetableCriteria> = T extends any ? FormatSpecTypes[T['type']]['defaultCriteria'] & Omit<T, keyof FormatFlowTypes<T>[T['type']]['mountedCriteria']> & FormatFlowTypes<T>[T['type']]['mountedCriteria'] & StaticMountedCriteria : never;
type GuardedCriteria<T extends SetableCriteria = SetableCriteria> = T['nullish'] extends true ? FormatFlowTypes<T>[T['type']]['guardedCriteria'] | undefined | null : FormatFlowTypes<T>[T['type']]['guardedCriteria'];
/**
 * @template T Extended interface of `SettableCriteriaTemplate` that
 * defines the format criteria users must or can specify.
 * @template U Custom members you want to add to the format.
 */
type Format<T extends SetableCriteria = SetableCriteria, U extends Record<string, any> = {}> = {
    type: T['type'];
    defaultCriteria: FormatSpecTypes[T['type']]['defaultCriteria'];
    mount?(chunk: MountingChunk, criteria: T): void;
    check(chunk: CheckingChunk, criteria: MountedCriteria<T>, value: unknown): CheckingReject['code'] | null;
} & U;
type FormatNativeNames = (typeof formatNatives)[number]['type'];

declare class FormatsManager {
    private store;
    constructor();
    add(formats: Format[]): void;
    get(type: FormatNames): Format;
}

interface Events {
    "NODE_MOUNTED": (node: MountedCriteria, path: PathSegments) => void;
    "TREE_MOUNTED": (rootNode: MountedCriteria) => void;
    "DATA_CHECKED": (rootNode: MountedCriteria, rootData: unknown, reject: CheckingReject | null) => void;
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
declare class Schema<const T extends SetableCriteria = SetableCriteria<FormatNativeNames>> {
    private _criteria;
    protected managers: {
        formats: FormatsManager;
        events: EventsManager;
    };
    protected initiate(definedCriteria: T): void;
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
    validate(data: unknown): data is GuardedCriteria<T>;
    /**
     * Evaluates the provided data against the schema.
     *
     * @param data - The data to be evaluated.
     *
     * @returns An object containing:
     * - `{ reject: CheckingReject }` if the data is **rejected**.
     * - `{ data: GuardedCriteria<T> }` if the data is **accepted**.
     */
    evaluate(data: unknown): {
        reject: CheckingReject;
        data?: undefined;
    } | {
        data: GuardedCriteria<T>;
        reject?: undefined;
    };
}

type SchemaInfer<T> = T extends Schema<infer U> ? GuardedCriteria<U> : never;
type SchemaInstance<T extends SetableCriteria = SetableCriteria> = InstanceType<typeof Schema<T>>;
type SchemaParameters<T extends SetableCriteria = SetableCriteria> = ConstructorParameters<typeof Schema<T>>;
interface SchemaPlugin {
    formats: Format[];
    [key: PropertyKey]: any;
}

type MixinPluginsCriteria<P1C, P1M extends SchemaPlugin, P2C, P2M extends SchemaPlugin, P3C, P3M extends SchemaPlugin> = (P1C extends SetableCriteria ? P2C extends SetableCriteria ? P3C extends SetableCriteria ? SetableCriteria extends P3C ? P1C | P2C | P3C : SetableCriteria<(P1M['formats'] | P2M['formats'] | P3M['formats'])[number]['type'] | FormatNativeNames> : SetableCriteria extends P2C ? P1C | P2C : SetableCriteria<(P1M['formats'] | P2M['formats'])[number]['type'] | FormatNativeNames> : SetableCriteria extends P1C ? P1C : SetableCriteria<P1M['formats'][number]['type'] | FormatNativeNames> : never);
type MixinSchemaPlugin<P1C, P1M extends SchemaPlugin, P2C, P2M extends SchemaPlugin, P3C, P3M extends SchemaPlugin> = P1C extends SetableCriteria ? P2C extends SetableCriteria ? P3C extends SetableCriteria ? SchemaInstance<P1C & P2C & P3C> & P1M & P2M & P3M : SchemaInstance<P1C & P2C> & P1M & P2M : SchemaInstance<P1C> & P1M : never;
type MixinPlugins<P1C, P1M extends SchemaPlugin, P2C, P2M extends SchemaPlugin, P3C, P3M extends SchemaPlugin> = new (...args: [MixinPluginsCriteria<P1C, P1M, P2C, P2M, P3C, P3M>]) => Omit<MixinSchemaPlugin<P1C, P1M, P2C, P2M, P3C, P3M>, "formats">;
declare function SchemaFactory<P1C extends SetableCriteria, P1M extends SchemaPlugin, P2C = unknown, P2M extends SchemaPlugin = never, P3C = unknown, P3M extends SchemaPlugin = never>(plugin1: (...args: [P1C]) => P1M, plugin2?: (...args: [P2C]) => P2M, plugin3?: (...args: [P3C]) => P3M): MixinPlugins<P1C, P1M, P2C, P2M, P3C, P3M>;

type StandardTags = "Undefined" | "Boolean" | "String" | "Function" | "Promise" | "Array" | "ArrayBuffer" | "SharedArrayBuffer" | "Int8Array" | "Int16Array" | "Int32Array" | "Uint8Array" | "Uint8ClampedArray" | "Uint16Array" | "Uint32Array" | "Float32Array" | "Float64Array" | "BigInt64Array" | "BigUint64Array" | "DataView" | "Map" | "Set" | "WeakMap" | "WeakSet" | "WeakRef" | "Proxy" | "RegExp" | "Error" | "Date" | "FinalizationRegistry" | "BigInt" | "Symbol" | "Iterator" | "AsyncFunction" | "GeneratorFunction" | "AsyncGeneratorFunction" | "Atomics" | "JSON" | "Math" | "Reflect" | "Null" | "Number" | "Generator" | "AsyncGenerator" | "Object" | "Intl.Collator" | "Intl.DateTimeFormat" | "Intl.ListFormat" | "Intl.NumberFormat" | "Intl.PluralRules" | "Intl.RelativeTimeFormat" | "Intl.Locale";

declare function getInternalTag(target: unknown): LooseAutocomplete<StandardTags>;

declare function base16ToBase64(input: string, to?: "B64" | "B64URL", padding?: boolean): string;
declare function base16ToBase32(input: string, to?: "B16" | "B16HEX", padding?: boolean): string;
declare function base64ToBase16(input: string, from?: "B64" | "B64URL"): string;
declare function base32ToBase16(input: string, from?: "B16" | "B16HEX"): string;

declare class Issue extends Error {
    constructor(context: string, message: string, plugin?: string);
}

export { Issue, Schema, SchemaFactory, base16ToBase32, base16ToBase64, base32ToBase16, base64ToBase16, getInternalTag, isArray, isAscii, isAsyncFunction, isAsyncGeneratorFunction, isBase16, isBase32, isBase32Hex, isBase64, isBase64Url, isBasicFunction, isDataUrl, isDomain, isEmail, isFunction, isGeneratorFunction, isIp, isIpV4, isIpV6, isObject, isPlainObject, isTypedArray, isUuid, testers };
export type { FlowTypesTemplate, Format, FormatFlowTypes, FormatNames, FormatNativeNames, FormatSpecTypes, GuardedCriteria, MountedCriteria, SchemaInfer, SchemaInstance, SchemaParameters, SchemaPlugin, SetableCriteria, SetableCriteriaTemplate, SpecTypesTemplate };
