interface UndefinedSetableCriteria extends SetableCriteriaTemplate<"undefined"> {
}
interface UndefinedDerivedCriteria extends DerivedCriteriaTemplate<{}, null> {
}

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
type BasicFunction = (...args: any[]) => unknown;
type AsyncFunction = (...args: any[]) => Promise<unknown>;

declare function isObject(x: null | undefined | number | bigint | string | boolean | symbol | object): x is object;
declare function isObject(x: unknown): x is BasicObject;
declare function isPlainObject(x: null | undefined | number | bigint | string | boolean | symbol | object): x is object;
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

/**
 * Check if all characters in the string are part of the ASCII table.
 *
 * An empty string will return `false`.
 */
declare function isAscii(str: string, options?: undefined): boolean;

interface UuidOptions {
    /** Specifies the allowed version number, between 1 and 7. */
    version?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
}
/**
 * **Standard :** RFC 9562
 *
 * @version 1.0.0
 */
declare function isUuid(str: string, options?: UuidOptions): boolean;

interface EmailOptions {
    /** **Default:** `false` */
    allowLocalQuote?: boolean;
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
declare function isEmail(str: string, options?: EmailOptions): boolean;

/**
 * **Standard :** RFC 1035
 *
 * @version 1.0.0
 */
declare function isDomain(str: string, options?: undefined): boolean;

interface DataUrlOptions {
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
declare function isDataUrl(str: string, options?: DataUrlOptions): boolean;

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
interface IpOptions {
    /**
     * Defines the expected behavior for a CIDR suffix.
     * - `"reject"` : CIDR is rejected (ex: `"192.168.0.1"` true, `"192.168.0.1/24"` false)
     * - `"accept"` : CIDR is accepted (ex: `"192.168.0.1"` true, `"192.168.0.1/24"` true)
     * - `"expect"` : CIDR is expected (ex: `"192.168.0.1"` false, `"192.168.0.1/24"` true)
     *
     * **Default:** `"reject"`
     */
    cidr?: "reject" | "accept" | "expect";
}
/**
 * **Standard:** No standard
 *
 * @version 2.0.0
 */
declare function isIp(str: string, options?: IpOptions): boolean;
/**
 * **Standard:** No standard
 *
 * @version 2.0.0
 */
declare function isIpV4(str: string, options?: IpOptions): boolean;
/**
 * **Standard:** No standard
 *
 * @version 2.0.0
 */
declare function isIpV6(str: string, options?: IpOptions): boolean;

/**
 * **Standard :** RFC 4648
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-8
 *
 * @version 1.0.0
 */
declare function isBase16(str: string, options?: undefined): boolean;
/**
 * **Standard :** RFC 4648
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-6
 *
 * @version 1.0.0
 */
declare function isBase32(str: string, options?: undefined): boolean;
/**
 * **Standard :** RFC 4648
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-7
 *
 * @version 1.0.0
 */
declare function isBase32Hex(str: string, options?: undefined): boolean;
/**
 * **Standard :** RFC 4648
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-4
 *
 * @version 1.0.0
 */
declare function isBase64(str: string, options?: undefined): boolean;
/**
 * **Standard :** RFC 4648
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-5
 *
 * @version 1.0.0
 */
declare function isBase64Url(str: string, options?: undefined): boolean;

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

interface NatureMap {
    BASIC: BasicFunction;
    ASYNC: AsyncFunction;
    BASIC_GENERATOR: GeneratorFunction;
    ASYNC_GENERATOR: AsyncGeneratorFunction;
}
interface FunctionSetableCriteria extends SetableCriteriaTemplate<"function"> {
    nature?: keyof NatureMap | (keyof NatureMap)[];
}
interface FunctionMountedCriteria {
    natureBitcode: number;
}
type FunctionGuardedCriteria<T extends FunctionSetableCriteria> = T['nature'] extends (keyof NatureMap)[] ? NatureMap[T['nature'][number]] : [T['nature']] extends [keyof NatureMap] ? NatureMap[T['nature']] : Function;
interface FunctionDerivedCriteria<T extends FunctionSetableCriteria> extends DerivedCriteriaTemplate<FunctionMountedCriteria, FunctionGuardedCriteria<T>> {
}
type FunctionExceptionCodes = "NATURE_PROPERTY_MISDECLARED" | "NATURE_PROPERTY_STRING_MISCONFIGURED" | "NATURE_PROPERTY_ARRAY_MISCONFIGURED" | "NATURE_PROPERTY_ARRAY_ITEM_MISDECLARED" | "NATURE_PROPERTY_ARRAY_ITEM_MISCONFIGURED";
type FunctionRejectionCodes = "TYPE_FUNCTION_UNSATISFIED" | "NATURE_UNSATISFIED";
interface FunctionCustomMembers {
    natureBitflags: Record<keyof NatureMap, number>;
    tagBitflags: Record<string, number>;
}

interface BooleanSetableCriteria extends SetableCriteriaTemplate<"boolean"> {
    literal?: boolean;
}
interface BooleanDerivedCriteria extends DerivedCriteriaTemplate<{}, boolean> {
}
type BooleanRejectionCodes = "TYPE_BOOLEAN_UNSATISFIED" | "LITERAL_UNSATISFIED";

interface UnknownSetableCriteria extends SetableCriteriaTemplate<"unknown"> {
}
interface UnknownDerivedCriteria extends DerivedCriteriaTemplate<{}, unknown> {
}

type SetableLiteral$2 = symbol | symbol[] | Record<string | number, symbol>;
interface SymbolSetableCriteria extends SetableCriteriaTemplate<"symbol"> {
    literal?: SetableLiteral$2;
    custom?: (value: symbol) => boolean;
}
interface SymbolMountedCriteria {
    resolvedLiteral?: Set<symbol>;
}
type SymbolGuardedCriteria<T extends SymbolSetableCriteria> = T['literal'] extends Record<string | number, symbol> ? T['literal'][keyof T['literal']] : T["literal"] extends symbol[] ? T['literal'][number] : T['literal'] extends symbol ? T["literal"] : symbol;
interface SymbolDerivedCriteria<T extends SymbolSetableCriteria> extends DerivedCriteriaTemplate<SymbolMountedCriteria, SymbolGuardedCriteria<T>> {
}
type SymbolExceptionCodes = "LITERAL_PROPERTY_MISDECLARED" | "LITERAL_PROPERTY_ARRAY_MISCONFIGURED" | "LITERAL_PROPERTY_ARRAY_ITEM_MISDECLARED" | "LITERAL_PROPERTY_OBJECT_MISCONFIGURED" | "LITERAL_PROPERTY_OBJECT_KEY_MISDECLARED" | "LITERAL_PROPERTY_OBJECT_VALUE_MISDECLARED" | "CUSTOM_PROPERTY_MISDECLARED";
type SymbolRejectionCodes = "TYPE_SYMBOL_UNSATISFIED" | "LITERAL_UNSATISFIED" | "CUSTOM_UNSATISFIED";

type SetableLiteral$1 = number | number[] | Record<string | number, number>;
interface NumberSetableCriteria extends SetableCriteriaTemplate<"number"> {
    min?: number;
    max?: number;
    literal?: SetableLiteral$1;
    custom?: (value: number) => boolean;
}
interface NumberMountedCriteria {
    resolvedLiteral?: Set<number>;
}
type NumberGuardedCriteria<T extends NumberSetableCriteria> = T['literal'] extends Record<string | number, number> ? T['literal'][keyof T['literal']] : T["literal"] extends number[] ? T['literal'][number] : T['literal'] extends number ? T["literal"] : number;
interface NumberDerivedCriteria<T extends NumberSetableCriteria> extends DerivedCriteriaTemplate<NumberMountedCriteria, NumberGuardedCriteria<T>> {
}
type NumberExceptionCodes = "MIN_PROPERTY_MISDECLARED" | "MAX_PROPERTY_MISDECLARED" | "MIN_MAX_PROPERTIES_MISCONFIGURED" | "LITERAL_PROPERTY_MISDECLARED" | "LITERAL_PROPERTY_ARRAY_MISCONFIGURED" | "LITERAL_PROPERTY_ARRAY_ITEM_MISDECLARED" | "LITERAL_PROPERTY_OBJECT_MISCONFIGURED" | "LITERAL_PROPERTY_OBJECT_KEY_MISDECLARED" | "LITERAL_PROPERTY_OBJECT_VALUE_MISDECLARED" | "CUSTOM_PROPERTY_MISDECLARED";
type NumberRejectionCodes = "TYPE_NUMBER_UNSATISFIED" | "MIN_UNSATISFIED" | "MAX_UNSATISFIED" | "LITERAL_UNSATISFIED" | "CUSTOM_UNSATISFIED";

type StringTesters = typeof testers.string;
type SetableConstraintOptions<K extends keyof StringTesters> = StringTesters[K] extends (input: any, params: infer U) => any ? U : never;
type SetableConstraint = {
    [K in keyof StringTesters]?: boolean | SetableConstraintOptions<K>;
};
type SetableLiteral = string | string[] | Record<string | number, string>;
interface StringSetableCriteria extends SetableCriteriaTemplate<"string"> {
    min?: number;
    max?: number;
    regex?: RegExp;
    literal?: SetableLiteral;
    constraint?: SetableConstraint;
    custom?: (value: string) => boolean;
}
interface StringMountedCriteria {
    resolvedLiteral?: Set<string>;
    resolvedConstraint?: Map<string, object | undefined>;
}
type StringGuardedCriteria<T extends StringSetableCriteria> = T['literal'] extends Record<string | number, string> ? T['literal'][keyof T['literal']] : T["literal"] extends string[] ? T['literal'][number] : T['literal'] extends string ? T["literal"] : string;
interface StringDerivedCriteria<T extends StringSetableCriteria> extends DerivedCriteriaTemplate<StringMountedCriteria, StringGuardedCriteria<T>> {
}
type StringExceptionCodes = "MIN_PROPERTY_MISDECLARED" | "MAX_PROPERTY_MISDECLARED" | "MIN_MAX_PROPERTIES_MISCONFIGURED" | "REGEX_PROPERTY_MISDECLARED" | "LITERAL_PROPERTY_MISDECLARED" | "LITERAL_PROPERTY_ARRAY_MISCONFIGURED" | "LITERAL_PROPERTY_ARRAY_ITEM_MISDECLARED" | "LITERAL_PROPERTY_OBJECT_MISCONFIGURED" | "LITERAL_PROPERTY_OBJECT_KEY_MISDECLARED" | "LITERAL_PROPERTY_OBJECT_VALUE_MISDECLARED" | "CONSTRAINT_PROPERTY_MISDECLARED" | "CONSTRAINT_PROPERTY_OBJECT_MISCONFIGURED" | "CONSTRAINT_PROPERTY_OBJECT_KEY_MISDECLARED" | "CONSTRAINT_PROPERTY_OBJECT_KEY_MISCONFIGURED" | "CONSTRAINT_PROPERTY_OBJECT_VALUE_MISDECLARED" | "CUSTOM_PROPERTY_MISDECLARED";
type StringRejectionCodes = "TYPE_STRING_UNSATISFIED" | "MIN_UNSATISFIED" | "MAX_UNSATISFIED" | "REGEX_UNSATISFIED" | "LITERAL_UNSATISFIED" | "CONSTRAINT_UNSATISFIED" | "CUSTOM_UNSATISFIED";

interface SetableShape<T extends FormatTypes = FormatTypes> {
    [key: string | symbol | number]: SetableCriteria<T> | SetableShape<T>;
}
type SetableKey = SetableCriteria<"string" | "symbol">;
type SetableValue<T extends FormatTypes = FormatTypes> = SetableCriteria<T>;
interface ObjectSetableCriteria<T extends FormatTypes = FormatTypes> extends SetableCriteriaTemplate<"object"> {
    nature?: "PLAIN";
    min?: number;
    max?: number;
    shape?: SetableShape<T>;
    optional?: (string | symbol)[] | boolean;
    keys?: SetableKey;
    values?: SetableValue<T>;
}
type MountedShape<T extends SetableShape> = {
    [K in keyof T]: T[K] extends SetableCriteria ? MountedCriteria<T[K]> : T[K] extends SetableShape ? MountedCriteria<{
        type: "object";
        shape: T[K];
    }> : never;
};
interface ObjectMountedCriteria<T extends ObjectSetableCriteria> {
    shape: unknown extends T['shape'] ? undefined : ObjectSetableCriteria['shape'] extends T['shape'] ? MountedShape<SetableShape> | undefined : T['shape'] extends SetableShape ? MountedShape<T['shape']> : T['shape'];
    keys: unknown extends T['keys'] ? undefined : ObjectSetableCriteria['keys'] extends T['keys'] ? MountedCriteria<SetableKey> | undefined : T['keys'] extends SetableKey ? MountedCriteria<T['keys']> : T['keys'];
    values: unknown extends T['values'] ? undefined : ObjectSetableCriteria['values'] extends T['values'] ? MountedCriteria<SetableCriteria> | undefined : T['values'] extends SetableCriteria ? MountedCriteria<T['values']> : T['values'];
    declaredKeySet?: Set<string | symbol>;
    unforcedKeySet?: Set<string | symbol>;
    enforcedKeySet?: Set<string | symbol>;
}
type GuardedStaticKeys<T, U extends ObjectSetableCriteria['optional']> = [
    U
] extends [(string | symbol)[]] ? {
    [K in keyof T as K extends U[number] ? K : never]+?: T[K];
} & {
    [K in keyof T as K extends U[number] ? never : K]-?: T[K];
} : [U] extends [true] ? {
    [P in keyof T]+?: T[P];
} : {
    [P in keyof T]-?: T[P];
};
type GuardedStatic$1<T extends ObjectSetableCriteria['shape'], U extends ObjectSetableCriteria['optional']> = T extends SetableShape ? {
    -readonly [K in keyof GuardedStaticKeys<T, U>]: T[K] extends SetableCriteria ? GuardedCriteria<T[K]> : never;
} : {};
type GuardedDynamic$1<T extends ObjectSetableCriteria['keys'], U extends ObjectSetableCriteria['values']> = T extends SetableKey ? U extends SetableCriteria ? GuardedCriteria<T> extends infer V ? {
    [P in V as V extends PropertyKey ? V : never]: GuardedCriteria<U>;
} : never : GuardedCriteria<T> extends infer V ? {
    [P in V as V extends PropertyKey ? V : never]: unknown;
} : never : U extends SetableCriteria ? {
    [key: string | symbol]: GuardedCriteria<U>;
} : {};
type ObjectGuardedCriteria<T extends ObjectSetableCriteria> = [
    T['shape'],
    T['keys'],
    T['values']
] extends [undefined, undefined, undefined] ? {
    [key: string | symbol]: unknown;
} : GuardedStatic$1<T['shape'], T['optional']> extends infer S ? GuardedDynamic$1<T['keys'], T['values']> extends infer D ? [S, D] extends [never, never] ? {
    [key: string | symbol]: unknown;
} : S extends object ? D extends object ? {
    [K in keyof (D & S)]: K extends keyof S ? S[K] : K extends keyof D ? D[K] : never;
} : never : never : never : never;
interface ObjectDerivedCriteria<T extends ObjectSetableCriteria> extends DerivedCriteriaTemplate<ObjectMountedCriteria<T>, ObjectGuardedCriteria<T>> {
}
type ObjectExceptionCodes = "NATURE_PROPERTY_MISDECLARED" | "NATURE_PROPERTY_MISCONFIGURED" | "MIN_PROPERTY_MISDECLARED" | "MAX_PROPERTY_MISDECLARED" | "MAX_MIN_PROPERTIES_MISCONFIGURED" | "SHAPE_PROPERTY_MISDECLARED" | "SHAPE_PROPERTY_OBJECT_VALUE_MISDECLARED" | "SHAPE_MIN_PROPERTIES_MISCONFIGURED" | "SHAPE_MAX_PROPERTIES_MISCONFIGURED" | "SHAPE_MIN_MAX_PROPERTIES_KEYS_VALUES_PROPERTIES_UNDEFINED" | "OPTIONAL_PROPERTY_MISDECLARED" | "OPTIONAL_PROPERTY_ARRAY_ITEM_MISDECLARED" | "OPTIONAL_PROPERTY_SHAPE_PROPERTY_UNDEFINED" | "KEYS_PROPERTY_MISDECLARED" | "KEYS_PROPERTY_OBJECT_TYPE_PROPERTY_UNDEFINED" | "KEYS_PROPERTY_OBJECT_TYPE_PROPERTY_MISDECLARED" | "KEYS_PROPERTY_OBJECT_TYPE_PROPERTY_MISCONFIGURED" | "VALUES_PROPERTY_MISDECLARED";
type ObjectRejectionCodes = "TYPE_OBJECT_UNSATISFIED" | "NATURE_PLAIN_UNSATISFIED" | "MIN_UNSATISFIED" | "MAX_UNSATISFIED" | "SHAPE_UNSATISFIED";
interface ObjectCustomMembers {
    natures: (ObjectSetableCriteria['nature'])[];
    getUnforcedKeys: (optional: boolean | (string | symbol)[], declaredKeys: (string | symbol)[]) => (string | symbol)[];
    getEnforcedKeys: (optional: boolean | (string | symbol)[], declaredKeys: (string | symbol)[]) => (string | symbol)[];
    isShorthandShape(obj: object): obj is SetableShape;
}

type SetableItems<T extends FormatTypes = FormatTypes> = SetableCriteria<T>;
type SetableTuple<T extends FormatTypes = FormatTypes> = (SetableCriteria<T> | SetableTuple)[];
interface ArraySetableCriteria<T extends FormatTypes = FormatTypes> extends SetableCriteriaTemplate<"array"> {
    min?: number;
    max?: number;
    tuple?: SetableTuple<T>;
    items?: SetableItems<T>;
}
type MountedTuple<T extends SetableTuple> = T extends infer U ? {
    [I in keyof U]: U[I] extends SetableCriteria ? MountedCriteria<U[I]> : U[I] extends SetableTuple ? MountedCriteria<{
        type: "array";
        tuple: U[I];
    }> : never;
} : never;
interface ArrayMountedCriteria<T extends ArraySetableCriteria> {
    tuple: unknown extends T['tuple'] ? undefined : ArraySetableCriteria['tuple'] extends T['tuple'] ? MountedTuple<SetableTuple> | undefined : T['tuple'] extends SetableTuple ? MountedTuple<T['tuple']> : T['tuple'];
    items: unknown extends T['items'] ? undefined : ArraySetableCriteria['items'] extends T['items'] ? MountedCriteria<SetableItems> | undefined : T['items'] extends SetableItems ? MountedCriteria<T['items']> : T['items'];
}
type GuardedDynamic<T extends ArraySetableCriteria['items']> = T extends SetableItems ? GuardedCriteria<T>[] : [];
type GuardedStatic<T extends ArraySetableCriteria['tuple']> = T extends SetableTuple ? {
    [I in keyof T]: T[I] extends SetableCriteria ? GuardedCriteria<T[I]> : T[I] extends SetableTuple ? GuardedCriteria<{
        type: "array";
        tuple: T[I];
    }> : never;
} : [];
type ArrayGuardedCriteria<T extends ArraySetableCriteria> = [
    T['tuple'],
    T['items']
] extends [undefined, undefined] ? unknown[] : GuardedStatic<T['tuple']> extends infer U ? GuardedDynamic<T['items']> extends infer V ? [U, V] extends [never, never] ? unknown[] : U extends any[] ? V extends any[] ? [...U, ...V] : never : never : never : never;
interface ArrayDerivedCriteria<T extends ArraySetableCriteria> extends DerivedCriteriaTemplate<ArrayMountedCriteria<T>, ArrayGuardedCriteria<T>> {
}
type ArrayExceptionCodes = "MIN_PROPERTY_MISDECLARED" | "MAX_PROPERTY_MISDECLARED" | "MIN_MAX_PROPERTIES_MISCONFIGURED" | "TUPLE_PROPERTY_MISDECLARED" | "TUPLE_PROPERTY_ARRAY_ITEM_MISDECLARED" | "TUPLE_MIN_PROPERTIES_MISCONFIGURED" | "TUPLE_MAX_PROPERTIES_MISCONFIGURED" | "TUPLE_MIN_MAX_PROPERTIES_ITEMS_PROPERTY_UNDEFINED" | "ITEMS_PROPERTY_MISDECLARED";
type ArrayRejectionCodes = "TYPE_ARRAY_UNSATISFIED" | "MIN_UNSATISFIED" | "MAX_UNSATISFIED" | "TUPLE_UNSATISFIED";
interface ArrayCustomMembers {
    isShorthandTuple(obj: object): obj is SetableTuple;
}

type SetableUnion<T extends FormatTypes = FormatTypes> = [
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
type UnionExceptionCodes = "UNION_PROPERTY_UNDEFINED" | "UNION_PROPERTY_MISDECLARED" | "UNION_PROPERTY_ARRAY_MISCONFIGURED" | "UNION_PROPERTY_ARRAY_ITEM_MISDECLARED";

interface NullSetableCriteria extends SetableCriteriaTemplate<"null"> {
}
interface NullDerivedCriteria extends DerivedCriteriaTemplate<{}, null> {
}

type LooseAutocomplete<T extends string> = T | Omit<string, T>;

declare class SchemaException extends Error {
    name: string;
    constructor(message: string);
}
declare class SchemaNodeException extends Error {
    name: string;
    /**
     * Code related to the exception.
     */
    code: string;
    /**
     * Node related to the exception.
     */
    node: SetableCriteria;
    /**
     * Path of the node related to the rejection.
     */
    nodePath: NodePath;
    constructor(code: string, message: string, node: SetableCriteria, nodePath: NodePath);
}
declare class SchemaDataRejection {
    /**
     * Root of the data to be validated.
     */
    rootData: unknown;
    /**
     * Root node used for validation.
     */
    rootNode: MountedCriteria;
    /**
     * Label of the root node used for validation.
     */
    rootLabel: string | undefined;
    /**
     * Code related to the rejection.
     */
    code: string;
    /**
    * Data rejected.
    */
    data: unknown;
    /**
     * Node related to the rejection.
     */
    node: MountedCriteria;
    /**
     * Path of the node related to the rejection.
     */
    nodePath: NodePath;
    /**
     * Label of the  node related to the rejection.
     */
    label: string | undefined;
    /**
     * Message of the node related to the rejection.
     */
    message: string | undefined;
    constructor(rootData: unknown, rootNode: MountedCriteria, code: string, data: unknown, node: MountedCriteria, nodePath: NodePath);
}
declare class SchemaDataAdmission<GuardedData = unknown> {
    /**
     * Root of the validated data.
     */
    data: GuardedData;
    /**
     * Root node used for validation.
     */
    node: MountedCriteria;
    /**
     * Label of the root node used for validation.
     */
    label: string | undefined;
    constructor(data: GuardedData, node: MountedCriteria);
}

interface NodePath {
    /**
     * #### Explanation :
     * Array representing the path to the node in the criteria tree.
     *
     * #### Composition :
     * ```py
     * segment = (string / number / symbol)
     * path    = [*(...segment)]
     * ```
     *
     * #### Exemple :
     *  ```py
     * my-path = ["struct", "products", "item", "price"]
     * ```
    */
    explicit: (string | number | symbol)[];
    /**
     * #### Explanation :
     * Array representing the virtual path to the data represented by the node.
     *
     * #### Composition :
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
    implicit: (LooseAutocomplete<"&" | "%" | "string" | "number" | "symbol"> | number | symbol)[];
}
interface MounterChunkTask {
    node: SetableCriteria | MountedCriteria;
    partPath: Partial<NodePath>;
}
interface CheckerTask {
    data: unknown;
    node: MountedCriteria;
    nodePath: NodePath;
    /** The hook associated with this task or a descendant of the task */
    closerHook: CheckerHook | null;
}
/**
 * @template RejectionCodes
 * Strings representing possible rejection codes for the `“REJECT”` action.
 */
interface CheckerChunkTaskHook<RejectionCodes extends string = string> {
    onReject(rejection: CheckerRejection): {
        action: "REJECT";
        code: RejectionCodes;
    } | {
        action: "CANCEL";
        target: "CHUNK" | "BRANCH";
    };
    onAccept(): {
        action: "REJECT";
        code: RejectionCodes;
    } | {
        action: "CANCEL";
        target: "CHUNK";
    };
}
interface CheckerHook extends CheckerChunkTaskHook {
    /** Task that created (issued) this hook */
    sourceTask: CheckerTask;
    /** Index of the first task in the chunk that this hook’s sourceTask controls */
    chunkTaskIndex: number;
    /** Index of the specific task in the branch controlled by this hook’s sourceTask */
    branchTaskIndex: number;
    /** Index of the first hook in the chunk that this hook’s sourceTask controls */
    chunkHookIndex: number;
    /** Index of the specific hook in the branch controlled by this hook’s sourceTask */
    branchHookIndex: number;
}
interface CheckerChunkTask {
    data: CheckerTask['data'];
    node: CheckerTask['node'];
    hook?: CheckerChunkTaskHook;
}
type CheckerRejection = {
    issuerTask: CheckerTask;
    code: string;
};
type CheckerResult<GuardedData = unknown> = {
    success: false;
    rejection: SchemaDataRejection;
    admission: null;
} | {
    success: true;
    rejection: null;
    admission: SchemaDataAdmission<GuardedData>;
};

declare const nodeSymbol: unique symbol;

declare const formatNatives: (Format<UndefinedSetableCriteria, never, "TYPE_UNDEFINED_UNSATISFIED"> | Format<FunctionSetableCriteria, FunctionExceptionCodes, FunctionRejectionCodes, FunctionCustomMembers> | Format<BooleanSetableCriteria, "LITERAL_PROPERTY_MISDECLARED", BooleanRejectionCodes> | Format<UnknownSetableCriteria> | Format<SymbolSetableCriteria, SymbolExceptionCodes, SymbolRejectionCodes> | Format<NumberSetableCriteria, NumberExceptionCodes, NumberRejectionCodes> | Format<StringSetableCriteria, StringExceptionCodes, StringRejectionCodes> | Format<ObjectSetableCriteria<keyof SetableCriteriaMap<any>>, ObjectExceptionCodes, ObjectRejectionCodes, ObjectCustomMembers> | Format<ArraySetableCriteria<keyof SetableCriteriaMap<any>>, ArrayExceptionCodes, ArrayRejectionCodes, ArrayCustomMembers> | Format<UnionSetableCriteria<keyof SetableCriteriaMap<any>>, UnionExceptionCodes> | Format<NullSetableCriteria, never, "TYPE_NULL_UNSATISFIED">)[];

type SetableMessage = string | ((code?: string, data?: unknown, node?: MountedCriteria, nodePath?: NodePath) => string);
/**
 * Defines the criteria users must or can specify.
 *
 * @template T The name assigned to the format when the user selects the type.
 */
interface SetableCriteriaTemplate<T extends string> {
    type: T;
    label?: string;
    message?: SetableMessage;
}
interface SetableCriteriaMap<T extends keyof SetableCriteriaMap = any> {
    undefined: UndefinedSetableCriteria;
    function: FunctionSetableCriteria;
    boolean: BooleanSetableCriteria;
    unknown: UnknownSetableCriteria;
    symbol: SymbolSetableCriteria;
    number: NumberSetableCriteria;
    string: StringSetableCriteria;
    object: ObjectSetableCriteria<T>;
    array: ArraySetableCriteria<T>;
    union: UnionSetableCriteria<T>;
    null: NullSetableCriteria;
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
    function: T extends FunctionSetableCriteria ? FunctionDerivedCriteria<T> : never;
    symbol: T extends SymbolSetableCriteria ? SymbolDerivedCriteria<T> : never;
    number: T extends NumberSetableCriteria ? NumberDerivedCriteria<T> : never;
    string: T extends StringSetableCriteria ? StringDerivedCriteria<T> : never;
    object: T extends ObjectSetableCriteria ? ObjectDerivedCriteria<T> : never;
    array: T extends ArraySetableCriteria ? ArrayDerivedCriteria<T> : never;
    union: T extends UnionSetableCriteria ? UnionDerivedCriteria<T> : never;
    undefined: UndefinedDerivedCriteria;
    boolean: BooleanDerivedCriteria;
    unknown: UnknownDerivedCriteria;
    null: NullDerivedCriteria;
}
type SetableCriteria<T extends FormatTypes = FormatTypes> = SetableCriteriaMap<T>[T];
interface CommonMountedCriteria {
    [nodeSymbol]: {
        partPath: Partial<NodePath>;
        childNodes: Set<MountedCriteria>;
    };
}
type MountedCriteria<T extends SetableCriteria = SetableCriteria> = T extends any ? T extends {
    [nodeSymbol]: any;
} ? T : (Omit<T, keyof DerivedCriteriaMap<T>[T['type']]['mounted']> & DerivedCriteriaMap<T>[T['type']]['mounted'] & CommonMountedCriteria) : never;
type GuardedCriteria<T extends SetableCriteria = SetableCriteria> = DerivedCriteriaMap<T>[T['type']]['guarded'];
/**
 * @template T
 * Type of the criteria this format handles.
 *
 * @template ExceptionCodes
 * Possible exception codes that can be returned by the `mount` method.
 *
 * @template RejectionCodes
 * Possible rejection codes that can be returned by the `check` method.
 *
 * @template CustomMembers
 * Additional custom properties or methods added to the format object.
 */
type Format<T extends SetableCriteria = SetableCriteria, ExceptionCodes extends string = string, RejectionCodes extends string = string, CustomMembers extends object = object> = {
    type: T['type'];
    exceptions: {
        [K in ExceptionCodes]: string;
    };
    mount(chunk: MounterChunkTask[], criteria: T): ExceptionCodes | null;
    check(chunk: CheckerChunkTask[], criteria: MountedCriteria<T>, data: unknown): RejectionCodes | null;
} & CustomMembers;
type FormatNativeTypes = (typeof formatNatives)[number]['type'];

interface Events {
    NODE_MOUNTED: (node: MountedCriteria, nodePath: NodePath) => void;
    TREE_MOUNTED: (rootNode: MountedCriteria) => void;
    DATA_REJECTED: (rejection: SchemaDataRejection) => void;
    DATA_ADMITTED: (admission: SchemaDataAdmission) => void;
}

declare class FormatsManager {
    private store;
    constructor();
    add(formats: Format[]): void;
    has(type: FormatTypes): boolean;
    get(type: FormatTypes): Format;
}

declare class EventsManager {
    listeners: Map<keyof Events, ((...args: any[]) => any)[]>;
    constructor();
    on<K extends keyof Events>(event: K, callback: Events[K]): void;
    emit<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>): void;
    off<K extends keyof Events>(event: K, callback: Events[K]): void;
}

/**
 * The `Schema` class is used to define and validate data structures, ensuring they conform to criteria node.
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
     * @returns A boolean.
     */
    validate(data: unknown): data is GuardedCriteria<MountedCriteria<T>>;
    /**
     * Evaluates the provided data against the schema.
     *
     * @param data - The data to be evaluated.
     */
    evaluate(data: unknown): SchemaEvaluateResult<GuardedCriteria<MountedCriteria<T>>>;
    listener: {
        on: <K extends keyof Events>(event: K, callback: Events[K]) => void;
        off: <K extends keyof Events>(event: K, callback: Events[K]) => void;
    };
}

type SchemaEvaluateResult<GuardedData = unknown> = CheckerResult<GuardedData>;
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

type InternalTags = "Undefined" | "Boolean" | "String" | "Function" | "Promise" | "Array" | "ArrayBuffer" | "SharedArrayBuffer" | "Int8Array" | "Int16Array" | "Int32Array" | "Uint8Array" | "Uint8ClampedArray" | "Uint16Array" | "Uint32Array" | "Float32Array" | "Float64Array" | "BigInt64Array" | "BigUint64Array" | "DataView" | "Map" | "Set" | "WeakMap" | "WeakSet" | "WeakRef" | "Proxy" | "RegExp" | "Error" | "Date" | "FinalizationRegistry" | "BigInt" | "Symbol" | "Iterator" | "AsyncFunction" | "GeneratorFunction" | "AsyncGeneratorFunction" | "Atomics" | "JSON" | "Math" | "Reflect" | "Null" | "Number" | "Generator" | "AsyncGenerator" | "Object" | "Intl.Collator" | "Intl.DateTimeFormat" | "Intl.ListFormat" | "Intl.NumberFormat" | "Intl.PluralRules" | "Intl.RelativeTimeFormat" | "Intl.Locale";

declare function getInternalTag(target: unknown): LooseAutocomplete<InternalTags>;

declare const objectHelpers_getInternalTag: typeof getInternalTag;
declare namespace objectHelpers {
  export {
    objectHelpers_getInternalTag as getInternalTag,
  };
}

declare function base16ToBase32(str: string, to?: "B32" | "B32HEX", padding?: boolean): string;
declare function base16ToBase64(str: string, to?: "B64" | "B64URL", padding?: boolean): string;
declare function base32ToBase16(str: string, from?: "B32" | "B32HEX"): string;
declare function base64ToBase16(str: string, from?: "B64" | "B64URL"): string;

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

export { Schema, SchemaDataAdmission, SchemaDataRejection, SchemaException, SchemaFactory, SchemaNodeException, base16ToBase32, base16ToBase64, base32ToBase16, base64ToBase16, getInternalTag, helpers, isArray, isAscii, isAsyncFunction, isAsyncGeneratorFunction, isBase16, isBase32, isBase32Hex, isBase64, isBase64Url, isDataUrl, isDomain, isEmail, isFunction, isGeneratorFunction, isIp, isIpV4, isIpV6, isObject, isPlainObject, isTypedArray, isUuid, testers };
export type { AsyncFunction, BasicArray, BasicFunction, BasicObject, Format, DerivedCriteriaTemplate as FormatDerivedCriteriaTemplate, GuardedCriteria as FormatGuardedCriteria, MountedCriteria as FormatMountedCriteria, FormatNativeTypes, SetableCriteria as FormatSetableCriteria, SetableCriteriaTemplate as FormatSetableCriteriaTemplate, FormatTypes, InternalTags, PlainObject, SchemaInfer, SchemaInstance, SchemaParameters, SchemaPlugin, TypedArray };
