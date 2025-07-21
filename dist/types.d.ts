type LooseAutocomplete<T extends string> = T | Omit<string, T>;

interface NodePath {
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
    implicit: (LooseAutocomplete<"&" | "%" | "string" | "number" | "symbol"> | number | symbol)[];
}
interface MounterChunkTask {
    node: SetableCriteria | MountedCriteria;
    partPath: Partial<NodePath>;
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
    onReject(rejection: CheckerRejection): {
        action: "DEFAULT";
    } | {
        action: "IGNORE";
        target: "CHUNK" | "BRANCH";
    } | {
        action: "REJECT";
        code: R;
    };
}
interface CheckerWrapHooks extends CheckerHooks {
    taskOwner: CheckerTask;
    stackIndex: {
        chunk: number;
        branch: number;
    };
}
interface CheckerTask {
    data: unknown;
    node: MountedCriteria;
    fullPath: NodePath;
    stackHooks?: CheckerWrapHooks[];
}
interface CheckerChunkTask {
    data: CheckerTask['data'];
    node: CheckerTask['node'];
    hooks?: CheckerHooks;
}
type CheckerChunk = CheckerChunkTask[];
interface CheckerRejection {
    code: string;
    task: CheckerTask;
}

declare const nodeSymbol: unique symbol;

interface BasicObject {
    [key: string | symbol | number]: unknown;
}
type PlainObject = {
    [key: string | symbol]: unknown;
};
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

interface AsciiOptions {
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
declare function isAscii(str: string, options?: AsciiOptions): boolean;

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

interface EmailOptions {
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
declare function isBase64(str: string, options?: undefined): boolean;
/**
 * **Standard :** RFC 4648
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-5
 *
 * @version 1.0.0
 */
declare function isBase64Url(str: string, options?: undefined): boolean;
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
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-8
 *
 * @version 1.0.0
 */
declare function isBase16(str: string, options?: undefined): boolean;

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

interface NatureMap$1 {
    BASIC: BasicFunction;
    ASYNC: AsyncFunction;
    BASIC_GENERATOR: GeneratorFunction;
    ASYNC_GENERATOR: AsyncGeneratorFunction;
}
interface FunctionSetableCriteria extends SetableCriteriaTemplate<"function"> {
    nature?: keyof NatureMap$1 | (keyof NatureMap$1)[];
}
interface FunctionMountedCriteria {
    natureBitcode: number;
}
type FunctionGuardedCriteria<T extends FunctionSetableCriteria> = T['nature'] extends (keyof NatureMap$1)[] ? NatureMap$1[T['nature'][number]] : [T['nature']] extends [keyof NatureMap$1] ? NatureMap$1[T['nature']] : Function;
interface FunctionDerivedCriteria<T extends FunctionSetableCriteria> extends DerivedCriteriaTemplate<FunctionMountedCriteria, FunctionGuardedCriteria<T>> {
}
type FunctionExceptionCodes = "NATURE_PROPERTY_MALFORMED" | "NATURE_PROPERTY_STRING_MISCONFIGURED" | "NATURE_PROPERTY_ARRAY_LENGTH_MISCONFIGURED" | "NATURE_PROPERTY_ARRAY_ITEM_MISCONFIGURED";
type FunctionRejectionCodes = "TYPE_FUNCTION_UNSATISFIED" | "NATURE_UNSATISFIED";
interface FunctionCustomMembers {
    natureBitflags: Record<keyof NatureMap$1, number>;
    tagBitflags: Record<string, number>;
}

interface BooleanSetableCriteria extends SetableCriteriaTemplate<"boolean"> {
    literal: boolean;
}
interface BooleanDerivedCriteria extends DerivedCriteriaTemplate<{}, boolean> {
}
type BooleanRejectionCodes = "TYPE_BOOLEAN_UNSATISFIED" | "LITERAL_UNSATISFIED";

type SetableLiteral$2 = symbol | symbol[] | Record<string | number, symbol>;
interface SymbolSetableCriteria extends SetableCriteriaTemplate<"symbol"> {
    literal?: SetableLiteral$2;
}
interface SymbolMountedCriteria {
    resolvedLiteral?: Set<symbol>;
}
type SymbolGuardedCriteria<T extends SymbolSetableCriteria> = T['literal'] extends Record<string | number, symbol> ? T['literal'][keyof T['literal']] : T["literal"] extends symbol[] ? T['literal'][number] : T['literal'] extends symbol ? T["literal"] : symbol;
interface SymbolDerivedCriteria<T extends SymbolSetableCriteria> extends DerivedCriteriaTemplate<SymbolMountedCriteria, SymbolGuardedCriteria<T>> {
}
type SymbolExceptionCodes = "LITERAL_PROPERTY_MALFORMED" | "LITERAL_PROPERTY_ARRAY_MISCONFIGURED" | "LITERAL_PROPERTY_ARRAY_ITEM_MALFORMED" | "LITERAL_PROPERTY_OBJECT_MISCONFIGURED" | "LITERAL_PROPERTY_OBJECT_KEY_MALFORMED" | "LITERAL_PROPERTY_OBJECT_VALUE_MALFORMED";
type SymbolRejectionCodes = "TYPE_SYMBOL_UNSATISFIED" | "LITERAL_UNSATISFIED";

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
type NumberExceptionCodes = "MIN_PROPERTY_MALFORMED" | "MAX_PROPERTY_MALFORMED" | "MIN_AND_MAX_PROPERTIES_MISCONFIGURED" | "LITERAL_PROPERTY_MALFORMED" | "LITERAL_PROPERTY_ARRAY_MISCONFIGURED" | "LITERAL_PROPERTY_ARRAY_ITEM_MALFORMED" | "LITERAL_PROPERTY_OBJECT_MISCONFIGURED" | "LITERAL_PROPERTY_OBJECT_KEY_MALFORMED" | "LITERAL_PROPERTY_OBJECT_VALUE_MALFORMED" | "CUSTOM_PROPERTY_MALFORMED";
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
    regex?: string | RegExp;
    literal?: SetableLiteral;
    constraint?: SetableConstraint;
    custom?: (value: string) => boolean;
}
interface StringMountedCriteria {
    regex?: RegExp;
    resolvedLiteral?: Set<string>;
    resolvedConstraint?: Map<string, object | undefined>;
}
type StringGuardedCriteria<T extends StringSetableCriteria> = T['literal'] extends Record<string | number, string> ? T['literal'][keyof T['literal']] : T["literal"] extends string[] ? T['literal'][number] : T['literal'] extends string ? T["literal"] : string;
interface StringDerivedCriteria<T extends StringSetableCriteria> extends DerivedCriteriaTemplate<StringMountedCriteria, StringGuardedCriteria<T>> {
}
type StringExceptionCodes = "MIN_PROPERTY_MALFORMED" | "MAX_PROPERTY_MALFORMED" | "MIN_MAX_PROPERTIES_MISCONFIGURED" | "REGEX_PROPERTY_MALFORMED" | "LITERAL_PROPERTY_MALFORMED" | "LITERAL_PROPERTY_ARRAY_MISCONFIGURED" | "LITERAL_PROPERTY_ARRAY_ITEM_MALFORMED" | "LITERAL_PROPERTY_OBJECT_MISCONFIGURED" | "LITERAL_PROPERTY_OBJECT_KEY_MALFORMED" | "LITERAL_PROPERTY_OBJECT_VALUE_MALFORMED" | "CONSTRAINT_PROPERTY_MALFORMED" | "CONSTRAINT_PROPERTY_OBJECT_MISCONFIGURED" | "CONSTRAINT_PROPERTY_OBJECT_KEY_MALFORMED" | "CONSTRAINT_PROPERTY_OBJECT_KEY_MISCONFIGURED" | "CONSTRAINT_PROPERTY_OBJECT_VALUE_MALFORMED" | "CUSTOM_PROPERTY_MALFORMED";
type StringRejectionCodes = "TYPE_STRING_UNSATISFIED" | "MIN_UNSATISFIED" | "MAX_UNSATISFIED" | "REGEX_UNSATISFIED" | "LITERAL_UNSATISFIED" | "CONSTRAINT_UNSATISFIED" | "CUSTOM_UNSATISFIED";

interface NatureMap {
    UNKNOWN: unknown;
    NULL: null;
    UNDEFINED: undefined;
    NULLISH: undefined | null;
}
interface SimpleSetableCriteria extends SetableCriteriaTemplate<"simple"> {
    nature: keyof NatureMap;
}
interface SimpleMountedCriteria {
    natureBitcode: number;
}
interface SimpleDerivedCriteria<T extends SimpleSetableCriteria> extends DerivedCriteriaTemplate<SimpleMountedCriteria, NatureMap[T['nature']]> {
}
type SimpleExceptionCodes = "NATURE_PROPERTY_REQUIRED" | "NATURE_PROPERTY_MALFORMED" | "NATURE_PROPERTY_STRING_MISCONFIGURED";
type SimpleRejectionCodes = "NATURE_NULLISH_UNSATISFIED" | "NATURE_NULL_UNSATISFIED" | "NATURE_UNDEFINED_UNSATISFIED";
interface SimpleCustomMembers {
    natureBitflags: Record<keyof NatureMap, number>;
}

interface SetableShape$1<T extends FormatTypes = FormatTypes> {
    [key: string | symbol | number]: SetableCriteria<T> | SetableShape$1<T>;
}
type SetableKey = SetableCriteria<"string" | "symbol">;
type SetableValue<T extends FormatTypes = FormatTypes> = SetableCriteria<T>;
interface SetableAdditionalOptions$1<T extends FormatTypes = FormatTypes> {
    min?: number;
    max?: number;
    key?: SetableKey;
    value?: SetableValue<T>;
}
interface ObjectSetableCriteria<T extends FormatTypes = FormatTypes> extends SetableCriteriaTemplate<"object"> {
    shape: SetableShape$1<T>;
    nature?: "STANDARD" | "PLAIN";
    optional?: (string | symbol)[] | boolean;
    additional?: SetableAdditionalOptions$1<T> | boolean;
}
type MountedShape$1<T extends SetableShape$1> = {
    [K in keyof T]: T[K] extends SetableCriteria ? MountedCriteria<T[K]> : T[K] extends SetableShape$1 ? MountedCriteria<{
        type: "object";
        shape: T[K];
    }> : never;
};
interface MountedAdditionalOptions$1<T extends SetableAdditionalOptions$1> {
    min?: number;
    max?: number;
    key: unknown extends T['key'] ? undefined : SetableAdditionalOptions$1['key'] extends T['key'] ? MountedCriteria<SetableKey> | undefined : T['key'] extends SetableKey ? MountedCriteria<T['key']> : T['key'];
    value: unknown extends T['value'] ? undefined : SetableAdditionalOptions$1['value'] extends T['value'] ? MountedCriteria<SetableCriteria> | undefined : T['value'] extends SetableCriteria ? MountedCriteria<T['value']> : T['value'];
}
interface ObjectMountedCriteria<T extends ObjectSetableCriteria> {
    shape: MountedShape$1<T['shape']>;
    nature: unknown extends T['nature'] ? "standard" : ObjectSetableCriteria['nature'] extends T['nature'] ? NonNullable<ObjectSetableCriteria['nature']> : T['nature'];
    additional: unknown extends T['additional'] ? false : ObjectSetableCriteria['additional'] extends T['additional'] ? MountedAdditionalOptions$1<SetableAdditionalOptions$1> | boolean : T['additional'] extends SetableAdditionalOptions$1 ? MountedAdditionalOptions$1<T['additional']> : T['additional'];
    declaredKeySet?: Set<string | symbol>;
    unforcedKeySet?: Set<string | symbol>;
    enforcedKeySet?: Set<string | symbol>;
}
type GuardedDynamic$1<T extends ObjectSetableCriteria['additional']> = [
    T
] extends [SetableAdditionalOptions$1] ? T['key'] extends SetableKey ? T['value'] extends SetableCriteria ? GuardedCriteria<T['key']> extends infer U ? {
    [P in U as U extends PropertyKey ? U : never]: GuardedCriteria<T['value']>;
} : never : GuardedCriteria<T['key']> extends infer U ? {
    [P in U as U extends PropertyKey ? U : never]: unknown;
} : never : T['value'] extends SetableCriteria ? {
    [key: PropertyKey]: GuardedCriteria<T['value']>;
} : {} : [T] extends [true] ? {
    [key: PropertyKey]: unknown;
} : {};
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
type GuardedStatic$1<T extends SetableShape$1, U extends ObjectSetableCriteria['optional']> = {
    -readonly [K in keyof GuardedStaticKeys<T, U>]: T[K] extends SetableCriteria ? GuardedCriteria<T[K]> : never;
};
type ObjectGuardedCriteria<T extends ObjectSetableCriteria> = GuardedDynamic$1<T['additional']> extends infer D ? GuardedStatic$1<T['shape'], T['optional']> extends infer S ? {
    [K in keyof (D & S)]: K extends keyof S ? S[K] : K extends keyof D ? D[K] : never;
} : never : never;
interface ObjectDerivedCriteria<T extends ObjectSetableCriteria> extends DerivedCriteriaTemplate<ObjectMountedCriteria<T>, ObjectGuardedCriteria<T>> {
}
type ObjectExceptionCodes = "SHAPE_PROPERTY_MALFORMED" | "SHAPE_PROPERTY_OBJECT_VALUE_MALFORMED" | "NATURE_PROPERTY_MALFORMED" | "NATURE_PROPERTY_STRING_MISCONFIGURED" | "OPTIONAL_PROPERTY_MALFORMED" | "OPTIONAL_PROPERTY_ARRAY_ITEM_MALFORMED" | "OPTIONAL_PROPERTY_WITHOUT_SHAPE_PROPERTY_DEFINED" | "ADDITIONAL_PROPERTY_MALFORMED" | "ADDITIONAL_PROPERTY_WITHOUT_SHAPE_PROPERTY_DEFINED" | "ADDITIONAL__KEY_PROPERTY_MALFORMED" | "ADDITIONAL__KEY_PROPERTY_MISCONFIGURED" | "ADDITIONAL__VALUE_PROPERTY_MALFORMED" | "ADDITIONAL__MIN_PROPERTY_MALFORMED" | "ADDITIONAL__MAX_PROPERTY_MALFORMED" | "ADDITIONAL__MIN_AND_MAX_PROPERTIES_MISCONFIGURED";
type ObjectRejectionCodes = "TYPE_PLAIN_OBJECT_UNSATISFIED" | "TYPE_OBJECT_UNSATISFIED" | "SHAPE_UNSATISFIED" | "EXTENSIBLE_UNALLOWED" | "EXTENSIBLE_MIN_UNSATISFIED" | "EXTENSIBLE_MAX_UNSATISFIED";
interface ObjectCustomMembers {
    natures: (ObjectSetableCriteria['nature'])[];
    getUnforcedKeys: (optional: boolean | (string | symbol)[], declaredKeys: (string | symbol)[]) => (string | symbol)[];
    getEnforcedKeys: (optional: boolean | (string | symbol)[], declaredKeys: (string | symbol)[]) => (string | symbol)[];
    isShorthandShape(obj: object): obj is SetableShape$1;
}

type SetableShape<T extends FormatTypes = FormatTypes> = [
    ...(SetableCriteria<T> | SetableShape)[]
];
type SetableItem<T extends FormatTypes = FormatTypes> = SetableCriteria<T>;
interface SetableAdditionalOptions<T extends FormatTypes = FormatTypes> {
    min?: number;
    max?: number;
    item?: SetableItem<T>;
}
interface ArraySetableCriteria<T extends FormatTypes = FormatTypes> extends SetableCriteriaTemplate<"array"> {
    shape: SetableShape<T>;
    additional?: boolean | SetableAdditionalOptions<T>;
}
type MountedShape<T extends SetableShape> = T extends infer U ? {
    [I in keyof U]: U[I] extends SetableCriteria ? MountedCriteria<U[I]> : U[I] extends SetableShape ? MountedCriteria<{
        type: "array";
        shape: U[I];
    }> : never;
} : never;
interface MountedAdditionalOptions<T extends SetableAdditionalOptions> {
    min?: number;
    max?: number;
    item: unknown extends T['item'] ? undefined : SetableAdditionalOptions['item'] extends T['item'] ? MountedCriteria<SetableItem> | undefined : T['item'] extends SetableItem ? MountedCriteria<T['item']> : T['item'];
}
interface ArrayMountedCriteria<T extends ArraySetableCriteria> {
    shape: MountedShape<T['shape']>;
    additional: unknown extends T['additional'] ? false : ArraySetableCriteria['additional'] extends T['additional'] ? MountedAdditionalOptions<SetableAdditionalOptions> | boolean : T['additional'] extends SetableAdditionalOptions ? MountedAdditionalOptions<T['additional']> : T['additional'];
}
type GuardedDynamic<T extends ArraySetableCriteria['additional']> = [
    T
] extends [SetableAdditionalOptions] ? T['item'] extends SetableItem ? GuardedCriteria<T['item']>[] : [] : [T] extends [true] ? unknown[] : [];
type GuardedStatic<T extends SetableShape> = T extends infer U ? {
    [I in keyof U]: U[I] extends SetableCriteria ? GuardedCriteria<U[I]> : U[I] extends SetableShape ? GuardedCriteria<{
        type: "array";
        shape: U[I];
    }> : never;
} : never;
type ArrayGuardedCriteria<T extends ArraySetableCriteria> = GuardedDynamic<T['additional']> extends infer U ? GuardedStatic<T['shape']> extends infer V ? U extends any[] ? V extends any[] ? [...V, ...U] : never : never : never : never;
interface ArrayDerivedCriteria<T extends ArraySetableCriteria> extends DerivedCriteriaTemplate<ArrayMountedCriteria<T>, ArrayGuardedCriteria<T>> {
}
type ArrayExceptionCodes = "SHAPE_PROPERTY_REQUIRED" | "SHAPE_PROPERTY_MALFORMED" | "SHAPE_PROPERTY_ARRAY_ITEM_MALFORMED" | "ADDITIONAL_PROPERTY_MALFORMED" | "ADDITIONAL__ITEM_PROPERTY_MALFORMED" | "ADDITIONAL__MIN_PROPERTY_MALFORMED" | "ADDITIONAL__MAX_PROPERTY_MALFORMED" | "ADDITIONAL__MIN_AND_MAX_PROPERTIES_MISCONFIGURED";
type ArrayRejectionCodes = "TYPE_ARRAY_UNSATISFIED" | "SHAPE_UNSATISFIED" | "ADDITIONAL_UNALLOWED" | "ADDITIONAL_MIN_UNSATISFIED" | "ADDITIONAL_MAX_UNSATISFIED";
interface ArrayCustomMembers {
    isShorthandShape(obj: object): obj is SetableShape;
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
type UnionExceptionCodes = "UNION_PROPERTY_REQUIRED" | "UNION_PROPERTY_MALFORMED" | "UNION_PROPERTY_ARRAY_LENGTH_MISCONFIGURED" | "UNION_PROPERTY_ARRAY_ITEM_MALFORMED";

declare const formatNatives: (Format<FunctionSetableCriteria, FunctionExceptionCodes, FunctionRejectionCodes, FunctionCustomMembers> | {
    type: "boolean";
    exceptions: {
        LITERAL_PROPERTY_MALFORMED: string;
    };
    mount(chunk: MounterChunk, criteria: BooleanSetableCriteria): "LITERAL_PROPERTY_MALFORMED" | null;
    check(chunk: CheckerChunk, criteria: Omit<BooleanSetableCriteria, never> & CommonMountedCriteria, value: unknown): BooleanRejectionCodes | null;
} | {
    type: "symbol";
    exceptions: {
        LITERAL_PROPERTY_MALFORMED: string;
        LITERAL_PROPERTY_ARRAY_MISCONFIGURED: string;
        LITERAL_PROPERTY_ARRAY_ITEM_MALFORMED: string;
        LITERAL_PROPERTY_OBJECT_MISCONFIGURED: string;
        LITERAL_PROPERTY_OBJECT_KEY_MALFORMED: string;
        LITERAL_PROPERTY_OBJECT_VALUE_MALFORMED: string;
    };
    mount(chunk: MounterChunk, criteria: SymbolSetableCriteria): SymbolExceptionCodes | null;
    check(chunk: CheckerChunk, criteria: Omit<SymbolSetableCriteria, "resolvedLiteral"> & SymbolMountedCriteria & CommonMountedCriteria, value: unknown): SymbolRejectionCodes | null;
} | {
    type: "number";
    exceptions: {
        LITERAL_PROPERTY_MALFORMED: string;
        LITERAL_PROPERTY_ARRAY_MISCONFIGURED: string;
        LITERAL_PROPERTY_ARRAY_ITEM_MALFORMED: string;
        LITERAL_PROPERTY_OBJECT_MISCONFIGURED: string;
        LITERAL_PROPERTY_OBJECT_KEY_MALFORMED: string;
        LITERAL_PROPERTY_OBJECT_VALUE_MALFORMED: string;
        MIN_PROPERTY_MALFORMED: string;
        MAX_PROPERTY_MALFORMED: string;
        MIN_AND_MAX_PROPERTIES_MISCONFIGURED: string;
        CUSTOM_PROPERTY_MALFORMED: string;
    };
    mount(chunk: MounterChunk, criteria: NumberSetableCriteria): NumberExceptionCodes | null;
    check(chunk: CheckerChunk, criteria: Omit<NumberSetableCriteria, "resolvedLiteral"> & NumberMountedCriteria & CommonMountedCriteria, value: unknown): NumberRejectionCodes | null;
} | {
    type: "string";
    exceptions: {
        LITERAL_PROPERTY_MALFORMED: string;
        LITERAL_PROPERTY_ARRAY_MISCONFIGURED: string;
        LITERAL_PROPERTY_ARRAY_ITEM_MALFORMED: string;
        LITERAL_PROPERTY_OBJECT_MISCONFIGURED: string;
        LITERAL_PROPERTY_OBJECT_KEY_MALFORMED: string;
        LITERAL_PROPERTY_OBJECT_VALUE_MALFORMED: string;
        MIN_PROPERTY_MALFORMED: string;
        MAX_PROPERTY_MALFORMED: string;
        CUSTOM_PROPERTY_MALFORMED: string;
        MIN_MAX_PROPERTIES_MISCONFIGURED: string;
        REGEX_PROPERTY_MALFORMED: string;
        CONSTRAINT_PROPERTY_MALFORMED: string;
        CONSTRAINT_PROPERTY_OBJECT_MISCONFIGURED: string;
        CONSTRAINT_PROPERTY_OBJECT_KEY_MALFORMED: string;
        CONSTRAINT_PROPERTY_OBJECT_KEY_MISCONFIGURED: string;
        CONSTRAINT_PROPERTY_OBJECT_VALUE_MALFORMED: string;
    };
    mount(chunk: MounterChunk, criteria: StringSetableCriteria): StringExceptionCodes | null;
    check(chunk: CheckerChunk, criteria: Omit<StringSetableCriteria, keyof StringMountedCriteria> & StringMountedCriteria & CommonMountedCriteria, value: unknown): StringRejectionCodes | null;
} | Format<SimpleSetableCriteria, SimpleExceptionCodes, SimpleRejectionCodes, SimpleCustomMembers> | Format<ObjectSetableCriteria<keyof SetableCriteriaMap<any>>, ObjectExceptionCodes, ObjectRejectionCodes, ObjectCustomMembers> | Format<ArraySetableCriteria<keyof SetableCriteriaMap<any>>, ArrayExceptionCodes, ArrayRejectionCodes, ArrayCustomMembers> | {
    type: "union";
    exceptions: {
        UNION_PROPERTY_REQUIRED: string;
        UNION_PROPERTY_MALFORMED: string;
        UNION_PROPERTY_ARRAY_LENGTH_MISCONFIGURED: string;
        UNION_PROPERTY_ARRAY_ITEM_MALFORMED: string;
    };
    mount(chunk: MounterChunk, criteria: UnionSetableCriteria<keyof SetableCriteriaMap<any>>): UnionExceptionCodes | null;
    check(chunk: CheckerChunk, criteria: Omit<UnionSetableCriteria<keyof SetableCriteriaMap<any>>, "union"> & UnionMountedCriteria<UnionSetableCriteria<keyof SetableCriteriaMap<any>>> & CommonMountedCriteria, value: unknown): string | null;
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
    nullable?: boolean;
}
interface SetableCriteriaMap<T extends keyof SetableCriteriaMap = any> {
    function: FunctionSetableCriteria;
    boolean: BooleanSetableCriteria;
    symbol: SymbolSetableCriteria;
    number: NumberSetableCriteria;
    string: StringSetableCriteria;
    simple: SimpleSetableCriteria;
    object: ObjectSetableCriteria<T>;
    array: ArraySetableCriteria<T>;
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
    function: T extends FunctionSetableCriteria ? FunctionDerivedCriteria<T> : never;
    boolean: T extends BooleanSetableCriteria ? BooleanDerivedCriteria : never;
    symbol: T extends SymbolSetableCriteria ? SymbolDerivedCriteria<T> : never;
    number: T extends NumberSetableCriteria ? NumberDerivedCriteria<T> : never;
    string: T extends StringSetableCriteria ? StringDerivedCriteria<T> : never;
    simple: T extends SimpleSetableCriteria ? SimpleDerivedCriteria<T> : never;
    object: T extends ObjectSetableCriteria ? ObjectDerivedCriteria<T> : never;
    array: T extends ArraySetableCriteria ? ArrayDerivedCriteria<T> : never;
    union: T extends UnionSetableCriteria ? UnionDerivedCriteria<T> : never;
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
type GuardedCriteria<T extends SetableCriteria = SetableCriteria> = T['nullable'] extends true ? DerivedCriteriaMap<T>[T['type']]['guarded'] | null : DerivedCriteriaMap<T>[T['type']]['guarded'];
/**
 * @template T Extended interface of `SettableCriteriaTemplate` that
 * defines the format criteria users must or can specify.
 * @template E Error codes you want to use in the format.
 * @template M Custom members you want to add to the format.
 */
type Format<T extends SetableCriteria = SetableCriteria, E extends string = string, R extends string = string, C extends {} = {}> = {
    type: T['type'];
    exceptions: {
        [K in E]: string;
    };
    mount(chunk: MounterChunk, criteria: T): E | null;
    check(chunk: CheckerChunk, criteria: MountedCriteria<T>, value: unknown): R | null;
} & C;
type FormatNativeTypes = (typeof formatNatives)[number]['type'];

declare class SchemaNodeException extends Error {
    code: string;
    message: string;
    node: SetableCriteria;
    nodePath: NodePath;
    constructor(report: NodeExceptionReport);
}
declare class SchemaDataRejection {
    /**
     * Syntax: `<MEMBER>[<DETAIL>]<REASON>`
     *
     * Components:
     * - `<MEMBER>`    : The criterion involved (e.g. EMPTY, MIN, ENUM)
     * - `<DETAIL>`    : Specific detail or sub-aspect of the criteria (e.g. LENGTH, PATTERN)
     * - `<REASON>`    : The reason for rejection (e.g. NOT_SATISFIED, NOT_ALLOWED)
     */
    code: string;
    node: SetableCriteria;
    nodePath: NodePath;
    constructor(report: DataRejectionReport);
}

declare class FormatsManager {
    private store;
    constructor();
    add(formats: Format[]): void;
    has(type: string): boolean;
    get(type: FormatTypes): Format;
}

interface Events {
    "NODE_MOUNTED": (node: MountedCriteria, path: NodePath) => void;
    "TREE_MOUNTED": (rootNode: MountedCriteria) => void;
    "DATA_CHECKED": (rootNode: MountedCriteria, rootData: unknown, rejection: CheckerRejection | null) => void;
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
    evaluate(data: unknown): SchemaEvaluateResult<T>;
}

interface NodeExceptionReport {
    code: string;
    message: string;
    node: SetableCriteria;
    nodePath: NodePath;
}
interface DataRejectionReport {
    code: string;
    node: MountedCriteria;
    nodePath: NodePath;
}
type SchemaEvaluateResult<T extends SetableCriteria> = {
    rejection: SchemaDataRejection;
    data: null;
} | {
    rejection: null;
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

export { Issue, Schema, SchemaDataRejection, SchemaFactory, SchemaNodeException, base16ToBase32, base16ToBase64, base32ToBase16, base64ToBase16, getInternalTag, helpers, isArray, isAscii, isAsyncFunction, isAsyncGeneratorFunction, isBase16, isBase32, isBase32Hex, isBase64, isBase64Url, isDataUrl, isDomain, isEmail, isFunction, isGeneratorFunction, isIp, isIpV4, isIpV6, isObject, isPlainObject, isTypedArray, isUuid, testers };
export type { AsyncFunction, BasicArray, BasicFunction, BasicObject, DerivedCriteriaTemplate, Format, FormatNativeTypes, FormatTypes, GuardedCriteria, InternalTags, MountedCriteria, PlainObject, SchemaInfer, SchemaInstance, SchemaParameters, SchemaPlugin, SetableCriteria, SetableCriteriaTemplate, TypedArray };
