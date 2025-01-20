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

|Property|Type|Default|Description|
|--|--|--|--|
|`type`|`"number"`||Type name|
|`min`|`number`||Minimum value accepted|
|`max`|`number`||Maximum value accepted|
|`custom`|`(x: number) => boolean`||Customized test function|

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
|`type`|`"string"`||Type name|
|`min`|`number`||Minimum length accepted|
|`max`|`number`||Maximum length accepted|
|`empty`|`boolean`|`true`|If the string can be empty|
|`regex`|`RegExp`||A native regex|
|`custom`|`(x: string) => boolean`||Customized test function|

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

|Property|Type|Default|Description|
|--|--|--|--|
|`type`|`"boolean"`||Type name|

```ts
const schema = new Schema({
  type: "boolean"
});
```

### Symbol

|Property|Type|Default|Description|
|--|--|--|--|
|`type`|`"symbol"`||Type name|
|`symbol`|`symbol`||Symbol to check|

```ts
const mySymbol = Symbol("enjoy");

const schema = new Schema({
  type: "symbol",
  symbol: mySymbol
});
```
