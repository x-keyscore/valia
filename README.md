# ![logo-valia-h64-v2](https://github.com/user-attachments/assets/ea937a53-9b80-43d7-93ac-81538d9526f8) &middot; [![npm version](https://img.shields.io/npm/v/valia.svg?style=flat)](https://www.npmjs.com/package/valia)

A powerful, type-safe validation library for modern TypeScript apps, built for both server and client.

⚡ **Smart & Flexible**
<br/>
Seamlessly validate data in any environment. Designed to integrate naturally into your backend, frontend, or shared code.

🧠 **Type Inference**
<br/>
Define your schema once, and instantly get strongly typed data. No need for redundant interfaces. Combined with type guards, you get safe, predictable data handling across your codebase.

📦 **Built-in Validators**
<br/>
Includes ready-to-use, standards-compliant validators like `isEmail`, `isUuid`, `isIp`, and more. Saving you time and boilerplate.

## Table of Contents
- [Schema](#schema)
  - [Instance](#instance)
  - [Formats](#formats)
  - [Exemples](#exemples)
- [Testers](#testers)
  - [Object](#object)
  - [String](#string-1)
- [Helpers](#helpers)
  - [Object](#object-1)
  - [String](#string-2)

## Getting started
```
> npm install valia
```

Schema definition 
```ts
import { Schema } from 'valia';

const user = new Schema({ 
  type: "struct",
  struct: {
    name: { type: "string" },
    role: {
        type: "string",
        enum: ["WORKER", "CUSTOMER"]
    }
  }
});
```

Schema inference
```ts
type User = SchemaInfer<typeof user>;
```

Data validation
```ts
let data: unknown = {
  name: "Alice",
  role: "WORKER"
};

if (user.validate(data)) {
  console.log(data.name, data.role);
}
```

<br/><br/>
# Schema

## Instance
|Member|Description|
|--|--|
|`criteria`  |Property representing the mounted validation criteria.|
|`validate()`|Validates the provided data against the schema. A boolean is returned. This function is a type guard, so if it returns true, the value passed as a parameter will be of the type defined by your schema.<br/>[Learn more about type guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)|
|`evaluate()`|Validates the provided data against the schema. If the data is not validated, an object with `reject` is returned to allow the problem to be inspected.|

```ts
interface SchemaInstance {
  criteria: MountedCriteria;
  validate(data: unknown): data is GuardedCriteria;
  evaluate(data: unknown): {
    reject: SchemaReject
  } | {
    data: GuardedCriteria
  };
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

> The order in the property tables is the same order in which the checker performs validation.

### Global

|Property|Default|Description|
|--|--|--|
|`label?`  ||String that will be returned in the reject object. Ideal for adding your own error codes, for example.|
|`message?`||String that will be returned in the reject object.|
|`nullish?`||Allows `null` and `undefined`|

```ts
interface Criteria {
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
interface Criteria {
  type: "simple",
  simple: "null" | "undefined" | "nullish"  | "unknown" | "any";
}
```

### Number

|Property|Default|Description|
|--|--|--|
|`type`   |      |Format name|
|`empty?` |`true`|If the number can be zero|
|`min?`   |      |Minimum value accepted|
|`max?`   |      |Maximum value accepted|
|`enum?`  |      |Restrict the value to the items of an array, the values of an object, or the values of a TypeScript Enum.|
|`custom?`|      |Customized test function|

```ts
interface Criteria {
  type: "number";
  empty?: boolean;
  min?: number;
  max?: number;
  enum?: string[] | Record<string | number, string>;
  custom?: (x: string) => boolean;
}
```

### String

|Property|Default|Description|
|--|--|--|
|`type`    |      |Format name|
|`empty?`  |`true`|If the string can be empty|
|`min?`    |      |Minimum length accepted|
|`max?`    |      |Maximum length accepted|
|`enum?`   |      |Restrict the value to the items of an array, the values of an object, or the values of a TypeScript Enum.|
|`regex?`  |      |A native regex|
|`custom?` |      |Customized test function|
|`testers?`|      |Allows you to directly apply a test that you will find [here](#string-1), with its parameters if necessary.|

```ts
interface Criteria {
  type: "string";
  empty?: boolean;
  min?: number;
  max?: number;
  enum?: string[] | Record<string | number, string>;
  regex?: RegExp;
  custom?: (x: string) => boolean;
  testers?: { [key: TesterNames]: true | TesterConfigs };
}
```

### Boolean

|Property|Default|Description|
|--|--|--|
|`type`||Format name|

```ts
interface Criteria {
  type: "boolean";
}
```

### Struct

|Property|Default|Description|
|--|--|--|
|`type`       |       |Format name|
|`struct`     |       |Object mapping expected keys to their respective formats.|
|`optional?`  |`false`|Array of optional keys or boolean|
|`additional?`|`false`|Record of additional properties or boolean|

```ts
type SetableStruct = {
  [key: string | symbol]: SetableCriteria | SetableStruct;
}

interface Criteria {
  type: "struct";
  struct: SetableStruct;
  optional?: (string | symbol)[] | boolean;
  additional?: SetableCriteria<"record"> | boolean;
}
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
interface Criteria {
  type: "record";
  empty?: boolean;
  min?: number;
  max?: number;
  key: SetableCriteria<"string" | "symbol">;
  value: SetableCriteria;
}
```

### Tuple

|Property|Default|Description|
|--|--|--|
|`type`       |       |Format name|
|`tuple`      |       |Array mapping expected items to their respective formats.|
|`additional?`|`false`|Array of additional item or boolean|

```ts
interface Criteria {
  type: "tuple";
  tuple: [SetableCriteria, ...SetableCriteria[]];
  additional?: SetableCriteria<"array"> | boolean;
}
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
interface Criteria {
  type: "array";
  empty?: boolean;
  min?: number;
  max?: number;
  item: SetableCriteria;
}
```

### Union

|Property|Default|Description|
|--|--|--|
|`type` ||Format name|
|`union`||Table in which the possible criteria are specified|

```ts
interface Criteria {
  type: "union";
  union?: [SetableCriteria, ...SetableCriteria[]];
}
```

### Symbol

|Property|Default|Description|
|--|--|--|
|`type`   ||Format name|
|`symbol?`||Specific symbol|

```ts
interface Criteria {
  type: "symbol";
  symbol?: symbol;
}
```

## Exemples

### Simple schema

```ts
const user = new Schema({ 
  type: "struct",
  struct: {
    name: {
      type: "string",
      min: 3,
      max: 32
    },
    role: {
      type: "string",
      enum: ["WORKER", "CUSTOMER"]
    }
  }
});

const data = {
  name: "Alice",
  role: "WORKER"
};
```

### Composite schema

```ts
const name = new Schema({
  type: "string",
  min: 3,
  max: 32
});

const role = new Schema({
  type: "string",
  enum: ["WORKER", "CUSTOMER"]
});

const user = new Schema({ 
  type: "struct",
  struct: {
    name: name.criteria,
    role: role.criteria
  }
});

const data = {
  name: "Bob",
  role: "WORKER"
};
```

### Deep composite schema

```ts
const name = new Schema({
  type: "string",
  min: 3,
  max: 32
});

const setting = new Schema({
  type: "struct",
  struct: {
    theme: {
      type: "string",
      enum: ["DARK", "LIGHT"]
    },
    notification: {
      type: "boolean"
    }
  }
});

const user = new Schema({ 
  type: "struct",
  struct: {
    name: name.criteria,
    theme: setting.criteria.struct.theme
  }
});

const data = {
  name: "Alice",
  theme: "DARK"
};
```

### Shorthand struct schema

In this schema only direct keys of the struct property can be defined as optional

```ts
const user = new Schema({ 
  type: "struct",
  struct: {
    name: {
      first: { type: "string" },
      last: { type: "string" }
    },
  }
});

const data = {
  name: {
    first: "Anders",
    last: "Hejlsberg"
  }
};
```

### Shorthand tuple schema

```ts
const color = new Schema({ 
  type: "tuple",
  tuple: [
    { type: "string" },
    [
      { type: "number" },
      { type: "number" },
      { type: "number" }
    ]
  ]
});

const data = ["red", [0, 100, 50]];
```

<br/><br/>

# Testers

### Object

|Function|Description|
|--|--|
|`isObject`                |Checks if it is an object|
|`isPlainObject`           |Checks if it is an object and if it has a prototype of `Object.prototype` or `null`|
|`isArray`                 |Checks if it is an array|
|`isTypedArray`            |Checks if it is an typed array|
|`isFunction`              |Checks if it is an function|
|`isBasicFunction`         |Checks if it is an function and if it is not `async`, `generator` or `async generator`.|
|`isAsyncFunction`         |Checks if it is an async function|
|`isGeneratorFunction`     |Checks if it is an generator function|
|`isAsyncGeneratorFunction`|Checks if it is an async generator function|

<br/>

### String

|Function|Description|
|--|--|
|`isAscii`    |**Standard:** No standard|
|`isIpV4`     |**Standard:** No standard|
|`isIpV6`     |**Standard:** No standard|
|`isIp`       |See **isIpV4** and **isIpV6**|
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
isAscii(str: string, params: AsciiParams): boolean;
```
|Parameter|Description|
|--|--|
|`onlyPrintable?: boolean`||

<br/>

```ts
isIp(str: string, params: IpParams): boolean;
```
|Parameter|Description|
|--|--|
|`allowPrefix?: boolean`|Allow prefixes at the end of IP addresses (e.g., `192.168.0.1/22`).|

<br/>

```ts
isEmail(str: string, params: EmailParams): boolean;
```
|Parameter|Description|
|--|--|
|`allowQuotedString?: boolean`  |Allows a string enclosed in quotes in the first part of the email address.|
|`allowIpAddress?: boolean`      |Allows an IPv4 or IPv6 address in place of the domain name.|
|`allowGeneralAddress?: boolean`|Allows an general address in place of the domain name.|

<br/>

```ts
isDataURL(str: string, params: DataUrlParams): boolean;
```
|Parameter|Description|
|--|--|
|`type?: string`     |Specifies the type of media. [Standard type](http://www.iana.org/assignments/media-types/)|
|`subtype?: string[]`|Specifies the sub-type of media. [Standard type](http://www.iana.org/assignments/media-types/)|

<br/>

```ts
isUuid(str: string, params?: UuidParams): boolean;
```
|Parameter|Description|
|--|--|
|`version?: 1\|2\|3\|4\|5\|6\|7`|The version you wish to validate. By default, all versions are validated.|

<br/><br/>

# Helpers

### Object

|Function|Description|
|--|--|
|`getInternalTag`|Extracts the internal type tag of a value (e.g. `"Array"`, `"Date"`).|


<br/>

### String

|Function|Description|
|--|--|
|`base16ToBase64`|**Standard :** RFC 4648<br/>Conversion of a string from **base16** to a string in **base64** or **base64Url**.|
|`base16ToBase32`|**Standard :** RFC 4648<br/>Conversion of a string from **base16** to a string in **base32** or **base32Hex**.|
|`base64ToBase16`|**Standard :** RFC 4648<br/>Conversion of a string from **base64** or **base64Url** to a string in **base16**.|
|`base32ToBase16`|**Standard :** RFC 4648<br/>Conversion of a string from **base32** or **base32Hex** to a string in **base16**.|

```ts
base16ToBase64(input: string, to: "B64" | "B64URL" = "B64", padding: boolean = true): string;

base16ToBase32(input: string, to: "B16" | "B16HEX" = "B16", padding: boolean = true): string;

base64ToBase16(input: string, from: "B64" | "B64URL" = "B64"): string;

base32ToBase16(input: string, from: "B16" | "B16HEX" = "B16"): string;
```
<br/><br/>

Developed with passion 🇫🇷
