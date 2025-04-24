# Valia &middot; [![npm version](https://img.shields.io/npm/v/valia.svg?style=flat)](https://www.npmjs.com/package/valia)

A powerful, type-safe validation library for modern TypeScript apps, built for both server and client.

⚡ **Smart & Flexible**
<br/>
Seamlessly validate data in any environment. Designed to integrate naturally into your backend, frontend, or shared code.

🧠 **Type Inference That Just Works**
<br/>
Define your schema once, and instantly get strongly typed data. No need for redundant interfaces. Combined with type guards, you get safe, predictable data handling across your codebase.

📦 **Built-in Validators**
<br/>
Includes ready-to-use, standards-compliant validators like `isEmail`, `isUuid`, `isIp`, and more. Saving you time and boilerplate.

## Table of Contents
- [Getting started](#getting-started)
- [Schema](#schema)
  - [Instance](#instance)
  - [Formats](#formats)
  - [Exemples](#exemples)
- [Testers](#testers)
  - [String](#string-1)
  - [Object](#object)
- [Tools](#tools)
  - [String](#string-2)

## Getting started
```
npm install valia
```
```ts
import { Schema } from 'valia';

const userSchema = new Schema({ 
  type: "struct",
  struct: {
    name: { type: "string" },
    role: {
        type: "string",
        enum: ["WORKER", "CUSTOMER"]
    }
  }
});

let data: unknown = { name: "Tintin", role: "WORKER" };

// Type safe
if (userSchema.validate(data)) console.log(data.role);
```

<br/><br/>
# Schema

## Instance
|Property / Method|Description|
|--|--|
|`criteria`  |Property representing the mounted validation criteria.|
|`validate()`|Validates the provided data against the schema. A boolean is returned. This function is a type guard, so if it returns true, the value passed as a parameter will be of the type defined by your schema.<br/>[Learn more about type guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)|
|`evaluate()`|Validates the provided data against the schema. An object is returned with the value passed as a parameter and the rejection status. If the reject status is null, then the returned value will have the type defined by your schema.|

```ts
interface SchemaInstance {
  criteria: MountedCriteria;
  validate(data: unknown): data is GuardedCriteria;
  evaluate(data: unknown): { reject: SchemaReject, data: null } | { reject: null, data: GuardedCriteria };
}
```
```ts
interface SchemaReject {
  path: {
    explicit: [];
    implicit: [];
  };
  code: string;
  type: string;
  label: string | undefined;
  message: string | undefined;
};
```

## Formats

[Simple](#simple) • [Number](#number) • [String](#string) • [Boolean](#boolean) • [Struct](#struct) • [Record](#record) • [Tuple](#tuple) • [Array](#array) • [Union](#union) • [Symbol](#symbol)

> The order in the property tables is the same order in which the checker executes the tests.

### Global

|Property|Default|Description|
|--|--|--|
|`label?`  ||String that will be returned in the reject object. Ideal for adding your own error codes, for example.|
|`message?`||String that will be returned in the reject object.|
|`nullish?`||Allows `null` or `undefined`|

```ts
interface Global {
  label?: string;
  message?: string;
  nullish?: boolean;
}
```

### Simple

|Property|Default|Description|
|--|--|--|
|`type`  ||Format name|
|`simple`||Simple type|

```ts
interface Simple {
  type: "simple",
  simple: "undefined" | "nullish" | "null" | "unknown" | "any";
}
```

```ts
new Schema({
  type: "simple",
  simple: "UNDEFINED"
});
```

### Number

|Property|Default|Description|
|--|--|--|
|`type`   ||Format name|
|`min?`   ||Minimum value accepted|
|`max?`   ||Maximum value accepted|
|`enum?`  ||Restrict the value to the items of an array, the values of an object, or the values of a TypeScript Enum.|
|`custom?`||Customized test function|

```ts
interface Number {
  type: "number";
  empty?: boolean;
  min?: number;
  max?: number;
  enum?: string[] | Record<string |number, string>;
  custom?: (x: string) => boolean;
}
```
```ts
new Schema({
  type: "number",
  min: 0,
  max: 50,
  custom(x) {
    return (x % 2 === 0);
  }
});
```

### String

|Property|Default|Description|
|--|--|--|
|`type`   |      |Format name|
|`empty?` |`true`|If the string can be empty|
|`min?`   |      |Minimum length accepted|
|`max?`   |      |Maximum length accepted|
|`enum?`  |      |Restrict the value to the items of an array, the values of an object, or the values of a TypeScript Enum.|
|`regex?` |      |A native regex|
|`tester?`|      |Allows you to directly apply a test that you will find [here](#string-1), with its parameters if necessary.|
|`custom?`|      |Customized test function|

```ts
interface String {
  type: "string";
  empty?: boolean;
  min?: number;
  max?: number;
  enum?: string[] | Record<string |number, string>;
  regex?: RegExp;
  tester?: { name: string, params: object }[];
  custom?: (x: string) => boolean;
}
```
```ts
new Schema({
  type: "string",
  min: 0,
  max: 6,
  empty: false,
  tester: { name: "isAscii" }
});
```

### Boolean

|Property|Default|Description|
|--|--|--|
|`type`||Format name|

```ts
interface Boolean {
  type: "boolean";
}
```
```ts
new Schema({
  type: "boolean"
});
```

### Struct

|Property|Default|Description|
|--|--|--|
|`type`     ||Format name|
|`optional?`||Array of optional keys|
|`struct`   ||The object keys represent the expected keys and the attributes represent the expected types. By default, all keys are mandatory.|

```ts
type SetableStruct = {
  [key: string | symbol]: SetableCriteria | SetableStruct;
}

interface Struct {
  type: "struct";
  optional?: (string | symbol)[];
  struct: SetableStruct;
}
```
```ts
new Schema({
  type: "struct",
  optional: ["description"],
  struct: {
    name: { type: "string", max: 20 },
    price: { type: "number", min: 0.1 },
    description: {
      brand: { type: "string", max: 40 },
      color: { type: "string", enum: ["BLACK", "WHITE"] }
    }
  }
});
```

### Record

|Property|Default|Description|
|--|--|--|
|`type`  |       |Format name|
|`empty?`|`false`|If the object can be empty|
|`min?`  |       |Minimum properties accepted|
|`max?`  |       |Maximum properties accepted|
|`key`   |       |Criteria of key|
|`value` |       |Criteria of value|

```ts
interface Record {
  type: "record";
  empty?: boolean;
  min?: number;
  max?: number;
  key: SetableCriteria<"string" | "symbol">;
  value: SetableCriteria;
}
```
```ts
new Schema({
  type: "record",
  max: 10,
  key: { type: "string" },
  value: { type: "number" }
});
```

### Tuple

|Property|Default|Description|
|--|--|--|
|`type`  ||Format name|
|`tuple` ||Criteria of the tuple items|

```ts
interface Tuple {
  type: "tuple";
  tuple: [SetableCriteria, ...SetableCriteria[]];
}
```
```ts
new Schema({
  type: "tuple",
  tuple: [{ type: "string" }, { type: "number" }]
});
```

### Array

|Property|Default|Description|
|--|--|--|
|`type`  |       |Format name|
|`empty?`|`false`|If the array can be empty|
|`min?`  |       |Minimum items accepted|
|`max?`  |       |Maximum items accepted|
|`item`  |       |Criteria of the array items|

```ts
interface Array {
  type: "array";
  empty?: boolean;
  min?: number;
  max?: number;
  item: SetableCriteria;
}
```
```ts
new Schema({
  type: "array",
  empty: true,
  tuple: [{ type: "string" }, { type: "number" }]
});
```

### Union

|Property|Default|Description|
|--|--|--|
|`type` ||Format name|
|`union`||Array in which the possible criteria are listed|

```ts
interface Union {
  type: "union";
  simple?: [SetableCriteria, ...SetableCriteria[]];
}
```
```ts
new Schema({
  type: "array",
  item: { type: "union", union: [{ type: "string"}, { type: "number" }] }
});
```

### Symbol

|Property|Default|Description|
|--|--|--|
|`type`   ||Format name|
|`symbol?`||Symbol to check|

```ts
interface Symbol {
  type: "symbol";
  symbol?: symbol;
}
```
```ts
const mySymbol = Symbol("my-symbol");

new Schema({
  type: "symbol",
  symbol: mySymbol
});
```

## Exemples


> The `criteria` properties of schemas are mounted only once, even if you use them in another schema.
> This can be useful if memory is an important consideration for you or if you plan to create many sub-schemas.

```ts
const nameFormat = new Schema({
  label: "NAME_FORMAT",
  type: "string",
  min: 3,
  max: 32
});

const ageFormat = new Schema({
  label: "AGE_FORMAT",
  type: "number",
  min: 13,
  max: 128
});

const userSchema = new Schema({ 
  type: "struct",
  struct: {
    name: nameFormat.criteria,
    age: ageFormat.criteria
  }
});

let data = { name: "Waitron", age: 200 };

const { reject } = userSchema.evaluate(data);

console.log(reject);
```
```
{
  path: {
    explicit: ['struct', 'age'],
    implicit: ['&', 'age']
  },
  code: 'DATA_SUPERIOR_MAX',
  type: 'number',
  label: 'AGE_FORMAT',
  message: undefined
}
```

<br/><br/>

# Testers

### String

|Function|Description|
|--|--|
|`isAscii`    |Check if all characters of the string are in the ASCII table.|
|`isIp`       |See **isIpV4** and **isIpV6**|
|`isIpV4`     |**Standard:** No standard|
|`isIpV6`     |**Standard:** No standard|
|`isEmail`    |**Standard:** RFC 5321|
|`isDomain`   |**Standard:** RFC 1035|
|`isDataURL`  |**Standard:** RFC 2397|
|`isUuid`     |**Standard:** RFC 9562|
|`isBase16`   |**Standard:** RFC 4648|
|`isBase32`   |**Standard:** RFC 4648|
|`isBase32Hex`|**Standard:** RFC 4648|
|`isBase64`   |**Standard:** RFC 4648|
|`isBase64Url`|**Standard:** RFC 4648|

<br/>

```ts
isIp(str:string, params: IsIpParams): boolean;
```
|Parameter|Description|
|--|--|
|`prefix?: boolean`|Must have a prefix at the end of the IP address indicating the subnet mask.<br/>(e.g., `192.168.0.1/22`)|

<br/>

```ts
isEmail(str:string, params: IsEmailParams): boolean;
```
|Parameter|Description|
|--|--|
|`allowQuotedString?: boolean`  |Allows a string enclosed in quotes in the first part of the email address.|
|`allowAddressLiteral?: boolean`|Allows an IPv4 or IPv6 address in place of the domain name.|

<br/>

```ts
isDataURL(str:string, params: IsDataUrlParams): boolean;
```
|Parameter|Description|
|--|--|
|`type?: string`   |Specifies the type of media, corresponding to the **image** type in the example.<br/>(e.g., `data:image/gif;base64,R0lGODdhMA`)|
|`subtype?: string[]`|Specifies the sub-type of media, corresponding to the **gif** sub-type in the example.<br/>(e.g., `data:image/gif;base64,R0lGODdhMA`)|

<br/>

```ts
isUuid(str: string, params?: IsUuidParams): boolean;
```
|Parameter|Description|
|--|--|
|`version?: 1\|2\|3\|4\|5\|6\|7`|The version you wish to validate. By default, all versions are validated.|

<br/>

### Object

|Function|Description|
|--|--|
|`isObject`                |Checks if it is an object.|
|`isPlainObject`           |Checks if it is an object and if it has a prototype of `Object.prototype` or `null`.|
|`isArray`                 |Checks if it is an array.|
|`isFunction`              |Checks if it is an function.|
|`isBasicFunction`         |Checks if it is a function but not an async, generator or async generator function. For example, an function like `async () => void` will return `false`.|
|`isAsyncFunction`         |Checks if it is an async function.|
|`isGeneratorFunction`     |Checks if it is an generator function.|
|`isAsyncGeneratorFunction`|Checks if it is an async generator function.|

<br/><br/>

# Tools

### String

|Function|Description|
|--|--|
|`base16ToBase64`|**Standard :** RFC 4648<br/>Conversion of a string from **base16** to a string in **base64** or **base64Url**.<br/>The input does not need to be in the standard, but the output will be.|
|`base16ToBase32`|**Standard :** RFC 4648<br/>Conversion of a string from **base16** to a string in **base32** or **base32Hex**.<br/>The input does not need to be in the standard, but the output will be.|
|`base64ToBase16`|**Standard :** RFC 4648<br/>Conversion of a string from **base64** or **base64Url** to a string in **base16**.<br/>The input does not need to be in the standard, but the output will be.|
|`base32ToBase16`|**Standard :** RFC 4648<br/>Conversion of a string from **base32** or **base32Hex** to a string in **base16**.<br/>The input does not need to be in the standard, but the output will be.|

```ts
base16ToBase64(input: string, to: "B64" | "B64URL" = "B64", padding: boolean = true): string;

base16ToBase32(input: string, to: "B16" | "B16HEX" = "B16", padding: boolean = true): string;

base64ToBase16(input: string, from: "B64" | "B64URL" = "B64"): string;

base32ToBase16(input: string, from: "B16" | "B16HEX" = "B16") => string;
```
<br/><br/>

Developed in France with passion 🇫🇷