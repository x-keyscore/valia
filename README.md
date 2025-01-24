# VALI.TS &middot; [![npm version](https://img.shields.io/npm/v/vali.ts.svg?style=flat)](https://www.npmjs.com/package/vali.ts) &middot; ![](https://img.shields.io/badge/ECMAScript-2018+-f7df1e)


A powerful, flexible, and high-performance TypeScript validator for runtime data validation and type safety.

## Table of Contents
- [Getting started](#getting-started)
- [Schema](#schema)
  - [Schema instance](#schema-instance)
  - [Schema definition](#schema-definition)
- [Testers](#testers)
  - [String](#string-1)

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
|Property|Type|Description|
|--|--|--|
|`criteria`|`MountedCriteria<VariantCriteria>`        |Property you need if you wish to use this schema in another one.|
|`guard`   |`(value: unknown) => boolean`             |Type guard method that returns a `boolean`.<br/>[Learn more about type guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)|
|`check`   |`(value: unknown) => SchemaReject \| null`|Method that returns [`SchemaReject`](#schemareject) if the value is rejected, otherwise `null`.|

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
  union: { type: "union", union: [{ type: "string"}, { type: "number" }]
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

|Function|Type|Description|
|--|--|--|
|`isAlpha` |`(input: string \| Uint16Array) => boolean`|Check if all characters of the string are between A and Z or a and z (%d65-%d90 / %d97-%d122)|
|`isDigit` |`(input: string \| Uint16Array) => boolean`|Check if all characters of the string are between 0 and 9 (%d48-%d57)|
|`isAscii` |`(input: string \| Uint16Array) => boolean`|Check if all characters of the string are in the ascii table (%d0-%d127)|
|`isDomain`|`(input: string \| Uint16Array) => boolean`|**Standard :** RFC 1035<br/>**Implementation version :** 1.0.0-beta|
|`isEmail` |`(input: string \| Uint16Array, params?: IsEmailParams) => boolean`|**Standard :** RFC 5321<br/>**Implementation version :** 1.1.0-beta|
|`isIp`    |`(input: string \| Uint16Array, params?: IsIpParams) => boolean`|**IPv4:**<br/>**Standard:** No standard<br/>**Implementation version :** 1.0.0<br/>**IPv6:**<br/>**Standard:** No standard<br/>**Implementation version :** 1.0.0|







