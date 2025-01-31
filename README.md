# VALI.TS &middot; [![npm version](https://img.shields.io/npm/v/vali.ts.svg?style=flat)](https://www.npmjs.com/package/vali.ts)

A powerful, flexible, and high-performance TypeScript validator for runtime data validation and type safety.

## Table of Contents
- [Getting started](#getting-started)
- [Schema](#schema)
  - [Instance](#schema-instance)
  - [Definition](#schema-definition)
- [Testers](#testers)
  - [String](#string-1)
  - [Object](#object)
- [Tools](#tools)
  - [String](#string-2)

## Getting started
```
npm install vali.ts
```
```ts
import { Schema } from 'vali.ts';

const mySchema = new Schema({ 
  type: "struct",
  struct: {
    name: { type: "string" },
    age: { type: "number", min: 13, max: 128 }
  }
});

let myData: unknown = { name: "Tintin", age: 63 };

if (mySchema.guard(myData)) {
  console.log(myData.name);// Type safe
}
```

# Schema

## Schema instance
|Property / Method|Description|
|--|--|
|`criteria`                               |Property you need if you wish to use this schema in another one.|
|`guard(value) => boolean`                |Type guard method that returns a `boolean`.<br/>[Learn more about type guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)|
|`check(value) => SchemaReject \| null`   |Method that returns [`SchemaReject`](#schemareject) if the value is rejected, otherwise `null`.|

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

let myData: unknown = { name: "Waitron", age: 200 };

const reject = userSchema.check(myData);

console.log(reject);
```
> [!NOTE]
> The `criteria` properties of schemas are mounted only once, even if you use them in another schema.
> This can be useful if memory is an important consideration for you or if you plan to create many sub-schemas.
```
{
  code: 'REJECT_VALUE_SUPERIOR_MAX',
  path: 'root.struct.age',
  type: 'number',
  label: 'AGE_FORMAT',
  message: undefined
}
```

#### `SchemaReject`
```ts
interface SchemaReject {
  /** `REJECT_<CATEGORY>_<DETAIL>` */
  code: string;
  type: string;
  path: string;
  label: string | undefined;
  message: string | undefined;
};
```

## Schema definition

[Number](#number) • [String](#string) • [Boolean](#boolean) • [Struct](#struct) •
[Record](#record) • [Tuple](#tuple) • [Array](#array) • [Union](#union) • [Symbol](#symbol)

> [!NOTE]
> The order of property definitions is the same as during the execution of tests by the checker.

### Global

|Property|Type|Default|Description|
|--|--|--|--|
|`optional?`|`boolean`|`false`|Allows `undefined`|
|`nullable?`|`boolean`|`false`|Allows `null`|
|`label?`   |`string` |       |String that will be returned in the error. Ideal for adding your own error codes, for example.|
|`message?` |`string` |       |String that will be returned in the error.|

```ts
const schema = new Schema({
  type: "string",
  optional: true,
  label: "OPTIONAL_STRING"
});
```

### Number

|Property|Type|Default|Description|
|--|--|--|--|
|`type`   |`"number"`              ||Type name|
|`min?`   |`number`                ||Minimum value accepted|
|`max?`   |`number`                ||Maximum value accepted|
|`custom?`|`(x: number) => boolean`||Customized test function|

```ts
const schema = new Schema({
  type: "number",
  min: 0,
  max: 50,
  custom(x) {
    return (x % 2 === 0);
  }
});
```

### String

|Property|Type|Default|Description|
|--|--|--|--|
|`type`   |`"string"`              |      |Type name|
|`min?`   |`number`                |      |Minimum length accepted|
|`max?`   |`number`                |      |Maximum length accepted|
|`empty?` |`boolean`               |`true`|If the string can be empty|
|`regex?` |`RegExp`                |      |A native regex|
|`custom?`|`(x: string) => boolean`|      |Customized test function|

```ts
const schema = new Schema({
  type: "string",
  min: 0,
  max: 6,
  empty: false,
  tester: { name: "isAscii" }
});
```

### Boolean

|Property|Type|Default|Description|
|--|--|--|--|
|`type`|`"boolean"`||Type name|

```ts
const schema = new Schema({
  type: "boolean"
});
```

### Struct

|Property|Type|Default|Description|
|--|--|--|--|
|`type`         |`"struct"`                          |       |Type name|
|`free?`        |`Array<string \| symbol>`           |       |Array of optional keys|
|`struct`       |`Record<string \| symbol, Criteria>`|       |The object's keys represent the expected keys<br/>and the attributes represent the expected types.<br/>By default, the keys are considered required.|

```ts
const schema = new Schema({
  type: "struct",
  free: ["description"],
  struct: {
    fistname: { type: "string" },
    lastname: { type: "string" },
    description: { type: "string" }
  }
});
```

### Record

|Property|Type|Default|Description|
|--|--|--|--|
|`type`  |`"record"`                  |       |Type name|
|`min?`  |`number`                    |       |Minimum properties accepted|
|`max?`  |`number`                    |       |Maximum properties accepted|
|`empty?`|`boolean`                   |`false`|If the object can be empty|
|`key`   |`Criteria<string \| symbol>`|       |Criteria of key|
|`value` |`Criteria`                  |       |Criteria of value|

```ts
const schema = new Schema({
  type: "record",
  max: 10,
  key: { type: "string" },
  value: { type: "number" }
});
```

### Tuple

|Property|Type|Default|Description|
|--|--|--|--|
|`type`  |`"tuple"`                  |       |Type name|
|`empty?`|`boolean`                  |`false`|If the array can be empty|
|`tuple` |`[Criteria, ...Criteria[]]`|       |Criteria of tuple|

```ts
const schema = new Schema({
  type: "tuple",
  empty: true,
  tuple: [{ type: "string" }, { type: "number" }
});
```

### Array

|Property|Type|Default|Description|
|--|--|--|--|
|`type`  |`"array"` |       |Type name|
|`min?`  |`number`  |       |Minimum items accepted|
|`max?`  |`number`  |       |Maximum items accepted|
|`empty?`|`boolean` |`false`|If the array can be empty|
|`item`  |`Criteria`|       |Criteria of the array items|

```ts
const schema = new Schema({
  type: "array",
  empty: true,
  tuple: [{ type: "string" }, { type: "number" }
});
```

### Union

|Property|Type|Default|Description|
|--|--|--|--|
|`type`  |`"union"`                  ||Type name|
|`union` |`[Criteria, ...Criteria[]]`||Array in which the possible criteria are listed|

```ts
const schema = new Schema({
  type: "array",
  item: { type: "union", union: [{ type: "string"}, { type: "number" }]
});
```

### Symbol

|Property|Type|Default|Description|
|--|--|--|--|
|`type`   |`"symbol"`||Type name|
|`symbol?`|`symbol`  ||Symbol to check|

```ts
const mySymbol = Symbol("enjoy");

const schema = new Schema({
  type: "symbol",
  symbol: mySymbol
});
```

# Testers

### String

|Function|Description|
|--|--|
|`isAscii`  |Check if all characters of the string are in the ASCII table.|
|`isBase`   |**Standard:** RFC 2397|
|`isIp`     |See `isIpV4` and `isIpV6`|
|`isIpV4`   |**Standard:** No standard|
|`isIpV6`   |**Standard:** No standard|
|`isEmail`  |**Standard :** RFC 5321|
|`isDomain` |**Standard :** RFC 1035|
|`isDataURL`|**Standard:** RFC 2397|

```ts
isAscii(str:string) => boolean;

isDomain(str:string) => boolean;

isBase[64|64Url|32|32Hex|16](str: string, params?: undefined): boolean;

isIp[V4|V6](str:string, params: IsIpParams) => boolean;
```
|Parameter|Description|
|--|--|
|`prefix?: boolean`|Must have a prefix at the end of the IP address indicating the subnet mask.<br/>(e.g., `192.168.0.1/22`)|

```ts
isEmail(str:string, params: IsEmailParams) => boolean;
```
|Parameter|Description|
|--|--|
|`allowQuotedString?: boolean`  |Allows a string enclosed in quotes in the first part of the email address.|
|`allowAddressLiteral?: boolean`|Allows an IPv4 or IPv6 address in place of the domain name.|

```ts
isDataURL(str:string, params: IsDataUrlParams) => boolean;
```
|Parameter|Description|
|--|--|
|`type?: string`   |Specifies the type of media, corresponding to the **image** type in the example.<br/>(e.g., `data:image/gif;base64,R0lGODdhMA`)|
|`subtype?: string[]`|Specifies the sub-type of media, corresponding to the **gif** sub-type in the example.<br/>(e.g., `data:image/gif;base64,R0lGODdhMA`)|

### Object

|Function|Description|
|--|--|
|`isObject`                |Checks if it is an object.|
|`isPlainObject`           |Checks if it is an object but does not inherit from a native prototype. For instance, it will return false for a RegExp object.|
|`isArray`                 |Checks if it is an array.|
|`isFunction`              |Checks if it is an function.|
|`isPlainFunction`         |Checks if it is a function but not an async, generator or async generator function. For example, an function like `async () => void` will return false.|
|`isAsyncFunction`         |Checks if it is an async function.|
|`isGeneratorFunction`     |Checks if it is an generator function.|
|`isAsyncGeneratorFunction`|Checks if it is an async generator function.|

# Tools

### String

|Function|Description|
|--|--|
|`base16ToBase64`|**Standard :** RFC 4648<br/>Conversion of a string from 'base16' to a string in 'base64' or 'base64Url'.<br/>The input does not need to be in the standard, but the output will be.|
|`base16ToBase32`|**Standard :** RFC 4648<br/>Conversion of a string from 'base16' to a string in 'base32' or 'base32Hex'.<br/>The input does not need to be in the standard, but the output will be.|
|`base64ToBase16`|**Standard :** RFC 4648<br/>Conversion of a string from 'base64' or 'base64Url' to a string in 'base16'.<br/>The input does not need to be in the standard, but the output will be.|
|`base32ToBase16`|**Standard :** RFC 4648<br/>Conversion of a string from 'base32' or 'base32Hex' to a string in 'base16'.<br/>The input does not need to be in the standard, but the output will be.|

```ts
base16ToBase64(input: string, to: "B64" | "B64URL" = "B64", padding: boolean = true) => string;

base16ToBase32(input: string, to: "B16" | "B16HEX" = "B16", padding: boolean = true) => string;

base64ToBase16(input: string, from: "B64" | "B64URL" = "B64") => string;

base32ToBase16(input: string, from: "B16" | "B16HEX" = "B16") => string;
```


