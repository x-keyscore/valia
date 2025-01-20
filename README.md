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

let data: any = { name: "Tintin", age: 63 };
if (schema.guard(data)) {
  // The “data” type is : { name: string; age: number: }
}
```

## Schema types

> **Note:** The order of property definitions is the same as during the execution of tests by the checker.

### Number

|Property|Type|Default|Require|Description|
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

|Property|Type|Default|Require|Description|
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
  regex: /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,
  tester: { name: "isAscii" }
  custom(x) {
    return ();
  }
});
```

### Boolean

|Property|Type|Default|Require|Description|
|--|--|--|--|--|
|`type`|`"boolean"`||Yes|Type name|

```ts
const schema = new Schema({
  type: "boolean"
});
```

### Struct

|Property|Type|Default|Require|Description|
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

### Symbol

|Property|Type|Default|Require|Description|
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

