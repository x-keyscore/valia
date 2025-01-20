# VALI.TS
A powerful, flexible, and high-performance TypeScript validator for runtime data validation and type safety.

## Getting started
```
npm install vali.ts
```
```ts
import { Schema } from 'vali.ts';

const schema = new Schema({ 
  type: "struct",
  struct: {
    name: { type: "string" },
    age: { type: "number", min: 13, max: 128 }
  }
});

let data: unknown = { name: "Tintin", age: 63 };

// This
if (schema.guard(data)) {
  console.log(data.user);// Type safe
}
// Or
const reject = schema.check(data);

if (reject) throw new Error("The reject code is :" reject.code);
```

## Schema types

> **Note:** The order of property definitions is the same as during the execution of tests by the checker.

[Number](#number) [String](#string) [Boolean](#boolean) [Struct](#struct) [Record](#record) [Tuple](#tuple) [Array](#array) [Union](#union) [Symbol](#symbol)

### Global

|Property|Type|Default|Required|Description|
|--|--|--|--|--|
|`optional`|`boolean`|`false`|No|Allows `undefined`|
|`nullable`|`boolean`|`false`|No |Allows `null`|
|`label`   |`string` |       |No |String that will be returned in the error. Ideal for adding your own error codes, for example.|
|`message` |`string` |       |No |String that will be returned in the error.|

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

### Number

|Property|Type|Default|Required|Description|
|--|--|--|--|--|
|`type`  |`"number"`              ||Yes|Type name|
|`min`   |`number`                ||No |Minimum value accepted|
|`max`   |`number`                ||No |Maximum value accepted|
|`custom`|`(x: number) => boolean`||No |Customized test function|

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

|Property|Type|Default|Required|Description|
|--|--|--|--|--|
|`type`  |`"string"`              |      |Yes|Type name|
|`min`   |`number`                |      |No |Minimum length accepted|
|`max`   |`number`                |      |No |Maximum length accepted|
|`empty` |`boolean`               |`true`|No |If the string can be empty|
|`regex` |`RegExp`                |      |No |A native regex|
|`custom`|`(x: string) => boolean`|      |No |Customized test function|

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

|Property|Type|Default|Required|Description|
|--|--|--|--|--|
|`type`|`"boolean"`||Yes|Type name|

```ts
const schema = new Schema({
  type: "boolean"
});
```

### Struct

|Property|Type|Default|Required|Description|
|--|--|--|--|--|
|`type`        |`"struct"`                          |       |Yes|Type name|
|`empty`       |`boolean`                           |`false`|No |If the object can be empty|
|`struct`      |`Record<string \| symbol, Criteria>`|       |Yes|The object's keys represent the expected keys<br>and the attributes represent the expected types.|
|`optionalKeys`|`Array<string \| symbol>`           |       |No |By default, the keys are considered required,<br>so you can define the optional keys in this array.|

```ts
const schema = new Schema({
  type: "struct",
  empty: true,
  optionalKeys: ["description"],
  struct: {
    fistname: { type: "string" },
    lastname: { type: "string" },
    description: { type: "string" }
  }
});
```

### Record

|Property|Type|Default|Required|Description|
|--|--|--|--|--|
|`type` |`"record"`                  |       |Yes|Type name|
|`min`  |`number`                    |       |No |Minimum properties accepted|
|`max`  |`number`                    |       |No |Maximum properties accepted|
|`empty`|`boolean`                   |`false`|No |If the object can be empty|
|`key`  |`Criteria<string \| symbol>`|       |Yes|Criteria of key|
|`value`|`Criteria`                  |       |Yes|Criteria of value|

```ts
const schema = new Schema({
  type: "record",
  max: 10,
  key: { type: "string" },
  value: { type: "number" }
});
```

### Tuple

|Property|Type|Default|Required|Description|
|--|--|--|--|--|
|`type` |`"tuple"`                  |       |Yes|Type name|
|`empty`|`boolean`                  |`false`|No |If the array can be empty|
|`tuple`|`[Criteria, ...Criteria[]]`|       |Yes|Criteria of tuple|

```ts
const schema = new Schema({
  type: "tuple",
  empty: true,
  tuple: [{ type: "string" }, { type: "number" }
});
```

### Array

|Property|Type|Default|Required|Description|
|--|--|--|--|--|
|`type` |`"array"` |       |Yes|Type name|
|`min`  |`number`  |       |No |Minimum items accepted|
|`max`  |`number`  |       |No |Maximum items accepted|
|`empty`|`boolean` |`false`|No |If the array can be empty|
|`item` |`Criteria`|       |Yes|Criteria of the array items|

```ts
const schema = new Schema({
  type: "array",
  empty: true,
  tuple: [{ type: "string" }, { type: "number" }
});
```

### Union

|Property|Type|Default|Required|Description|
|--|--|--|--|--|
|`type`  |`"union"`                  ||Yes|Type name|
|`union` |`[Criteria, ...Criteria[]]`||Yes|Array in which the possible criteria are listed|

```ts
const schema = new Schema({
  type: "array",
  union: { type: "union", union: [{ type: "string"}, { type: "number" }]
});
```

### Symbol

|Property|Type|Default|Required|Description|
|--|--|--|--|--|
|`type`  |`"symbol"`||Yes|Type name|
|`symbol`|`symbol`  ||No |Symbol to check|

```ts
const mySymbol = Symbol("enjoy");

const schema = new Schema({
  type: "symbol",
  symbol: mySymbol
});
```

