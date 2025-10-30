<p align="center">
  <br/>
  <img src="https://github.com/user-attachments/assets/ea937a53-9b80-43d7-93ac-81538d9526f8" align="center" alt="VALIA logo" />
  <br/>
  <br/>
  <img src="https://img.shields.io/npm/v/valia.svg?style=flat" align="center" alt="NPM version" />
  <br/>
  <h3 align="center">Validation Library for TypeScript and JavaScript</h3>
</p>
<br/>

🔌 Integrates seamlessly into your projects — whether front-end or back-end — allowing you to define schemas intuitively while promoting reusability.

💡 Designed to combine simplicity and power, it offers advanced features like type inference and built-in validators such as <strong>isEmail</strong>, <strong>isUuid</strong>, and <strong>isIp</strong>.

## Table of Contents

- [Schema](#schema)
  - [Instances](#schema-instances)
  - [Formats](#schema-formats)
  - [Examples](#schema-examples)
- [Testers](#testers)
  - [Object](#testers-object)
  - [String](#testers-string)
- [Helpers](#helpers)
  - [Object](#helpers-object)
  - [String](#helpers-string)

## Installation

```
> npm install valia
```

```ts
import { Schema } from 'valia';

const userSchema = new Schema({ 
  type: "object",
  shape: {
    name: { type: "string" },
    role: {
      type: "string",
      literal: ["WORKER", "CUSTOMER"]
    }
  }
});

let data = {
  name: "Alice",
  role: "WORKER"
};

if (userSchema.validate(data)) {
  console.log(data.name, data.role);
}
```

```ts
import type { SchemaInfer } from 'valia';

type User = SchemaInfer<typeof userSchema>;
```

<br/>

<a id="schema"></a>

# Schema

<a id="schema-instances"></a>

## Instances

### Schema

<ul>
  <li>
    <strong>criteria</strong>
    <br/>
    Property representing the root of the criteria nodes.
  </li>
  <li>
    <strong>validate(data)</strong>
    <br/>
    Method that validates the provided data according to the criteria and returns a boolean.
    <br/>
    This method uses <a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates">TypeScript type predicates ↗</a>.
  </li>
  <li>
    <strong>evaluate(data)</strong>
    <br/>
    Method that validates the provided data according to the criteria and returns an object with the following properties:
    <ul>
      <li>
        <strong>success</strong>: A boolean indicating whether validation succeeded.
      </li>
      <li>
        <strong>rejection</strong>: Instance of <strong>SchemaDataRejection</strong> if the data was rejected, otherwise <strong>null</strong>.
      </li>
      <li>
        <strong>admission</strong>: Instance of <strong>SchemaDataAdmission</strong> if the data was accepted, otherwise <strong>null</strong>.
      </li>
    </ul>
  </li>
</ul>

### SchemaException

<ul>
  <li>
    <strong>message</strong>
    <br/>
    Message describing the encountered issue.
  </li>
</ul>

### SchemaNodeException

<ul>
  <li>
    <strong>code</strong>
    <br/>
    The exception code.
  </li>
  <li>
    <strong>message</strong>
    <br/>
    Message describing the encountered issue.
  </li>
  <li>
    <strong>node</strong>
    <br/>
    Node related to the exception.
  </li>
  <li>
    <strong>nodePath</strong>
    Path of the node related to the exception.
    <ul>
      <li>
        <strong>explicit</strong>: Array representing the path to the node in the criteria tree.
      </li>
      <li>
        <strong>implicit</strong>: Array representing the virtual path to the data represented by the node.
      </li>
    </ul>
  </li>
</ul>

### SchemaDataRejection

<ul>
  <li>
    <strong>rootData</strong>
    <br/>
    Root of the data to be validated.
  </li>
  <li>
    <strong>rootNode</strong>
    <br/>
    Root node used for validation.
  </li>
  <li>
    <strong>rootLabel</strong>
    <br/>
    Label of the root node used for validation, or <strong>undefined</strong> if none was defined.
  </li>
  <li>
    <strong>data</strong>
    <br/>
    The rejected data.
  </li>
  <li>
    <strong>code</strong>
    <br/>
    Code associated with the rejection.
  </li>
  <li>
    <strong>node</strong>
    <br/>
    Node related to the rejection.
  </li>
  <li>
    <strong>nodePath</strong>
    <br/>
    Path of the node related to the rejection.
    <ul>
      <li>
        <strong>explicit</strong>: Array representing the path to the node in the criteria tree.
      </li>
      <li>
        <strong>implicit</strong>: Array representing the virtual path to the data represented by the node.
      </li>
    </ul>
  </li>
  <li>
    <strong>label</strong>
    <br/>
    Label defined on the node related to the rejection, or <strong>undefined</strong> if none was defined.
  </li>
  <li>
    <strong>message</strong>
    <br/>
    Message defined on the node related to the rejection, or <strong>undefined</strong> if none was defined.
  </li>
</ul>

### SchemaDataAdmission

<ul>
  <li>
    <strong>data</strong>
    <br/>
    Root of the validated data.
  </li>
  <li>
    <strong>node</strong>
    <br/>
    Root node used for validation.
  </li>
  <li>
    <strong>label</strong>
    <br/>
    Label of the root node used for validation, or <strong>undefined</strong> if none was defined.
  </li>
</ul>

<a id="schema-formats"></a>

## Formats

[Number](#number) • [String](#string) • [Boolean](#boolean) • [Object](#object) • [Array](#array) • [Function](#function) • [Symbol](#symbol) • [Union](#union) • [Null](#null) • [Undefined](#undefined)

Formats represent the criteria nodes that can be used within schemas.  
<br/>
*The order of properties described for each format follows the order of validation.*

### Global

#### **Properties:**

<ul>
  <li>
    <strong>label?</strong>
    <br/>
    A string identifying the node. It will be returned in instances of <strong>SchemaDataRejection</strong> and <strong>SchemaNodeException</strong>.
  </li>
  <br/>
  <li>
    <strong>message?</strong>
    <br/>
    <ul>
      <li><strong>string</strong>: A string that will be available in the <strong>SchemaDataRejection</strong> instance.</li>
      <li><strong>function</strong>: A function returning a string that will be available in the <strong>SchemaDataRejection</strong> instance.</li>
    </ul>
  </li>
</ul>

### Number

#### **Properties:**

<ul>
  <li><strong>type: "number"</strong></li>
  <br/>
  <li>
    <strong>min?</strong>
    <br/>
    Minimum value.
  </li>
  <br/>
  <li>
    <strong>max?</strong>
    <br/>
    Maximum value.
  </li>
  <br/>
  <li>
    <strong>literal?</strong>
    <br/>
    <ul>
      <li><strong>number</strong>: Restricts the value to a single valid number.</li>
      <li><strong>array</strong>: Restricts the value to a list of valid numbers.</li>
      <li><strong>object</strong>: Restricts the value to an object whose values represent valid numbers.</li>
    </ul>
  </li>
  <br/>
  <li>
    <strong>custom(value)?</strong>
    <br/>
    Custom validation function that receives the value as a parameter and must return a boolean indicating whether it is valid.
  </li>
</ul>

#### **Examples:**

**Validate any number**
```ts
const schema = new Schema({
  type: "number"
});

✅ schema.validate(0);
✅ schema.validate(10);
✅ schema.validate(-10);
```

**Validate numbers within a specific range**

```ts
const schema = new Schema({
  type: "number",
  min: 0,
  max: 10
});

✅ schema.validate(0);
✅ schema.validate(10);

❌ schema.validate(-1);
❌ schema.validate(11);
```

**Validate a specific number**

```ts
const schema = new Schema({
  type: "number",
  literal: 141
});

✅ schema.validate(141);

❌ schema.validate(-1);
❌ schema.validate(10);
```

**Validate specific numbers using an array**

```ts
const schema = new Schema({
  type: "number",
  literal: [141, 282]
});

✅ schema.validate(141);
✅ schema.validate(282);

❌ schema.validate(0);
❌ schema.validate(100);
❌ schema.validate(200);
```

### String

#### **Properties:**

<ul>
  <li><strong>type: "string"</strong></li>
  <br/>
  <li>
    <strong>min?</strong>
    <br/>
    Minimum string length.
  </li>
  <br/>
  <li>
    <strong>max?</strong>
    <br/>
    Maximum string length.
  </li>
  <br/>
  <li>
    <strong>regex?</strong>
    <br/>
    A regular expression provided as a <strong>RegExp</strong> object.
  </li>
  <br/>
  <li>
    <strong>literal?</strong>
    <br/>
    <ul>
      <li><strong>string</strong>: Restricts the value to a single valid string.</li>
      <li><strong>array</strong>: Restricts the value to a list of valid strings.</li>
      <li><strong>object</strong>: Restricts the value to an object whose values represent valid strings.</li>
    </ul>
  </li>
  <br/>
  <li>
    <strong>constraint?</strong>
    <br/>
    An object whose keys correspond to string tester names and whose values can be:
    <ul>
      <li><strong>boolean</strong>: Enables or disables the tester.</li>
      <li><strong>object</strong>: Enables the tester with the provided options.</li>
    </ul>
    The value is considered valid if at least one tester returns a positive result.
  </li>
  <br/>
  <li>
    <strong>custom(value)?</strong>
    <br/>
    Custom validation function that receives the value as a parameter and must return a boolean indicating whether it is valid.
  </li>
</ul>

#### **Examples:**

**Validate any string**

```ts
const schema = new Schema({
  type: "string"
});

✅ schema.validate("");
✅ schema.validate("abc");
```

**Validate strings with specific length**

```ts
const schema = new Schema({
  type: "string",
  min: 3,
  max: 3
});

✅ schema.validate("abc");

❌ schema.validate("");
❌ schema.validate("a");
❌ schema.validate("abcd");
```

**Validate strings using a regular expression**

```ts
const schema = new Schema({
  type: "string",
  regex: /^#[a-fA-F0-9]{6}$/
});

✅ schema.validate("#000000");
✅ schema.validate("#FFFFFF");

❌ schema.validate("");
❌ schema.validate("#000");
❌ schema.validate("#FFF");
```

**Validate a specific string**

```ts
const schema = new Schema({
  type: "string",
  literal: "ABC"
});

✅ schema.validate("ABC");

❌ schema.validate("");
❌ schema.validate("a");
❌ schema.validate("abc");
```

**Validate specific strings using an array**

```ts
const schema = new Schema({
  type: "string",
  literal: ["ABC", "XYZ"]
});

✅ schema.validate("ABC");
✅ schema.validate("XYZ");

❌ schema.validate("");
❌ schema.validate("a");
❌ schema.validate("abc");
```

**Validate strings using a string tester**

```ts
const schema = new Schema({
  type: "string",
  constraint: {
    isIp: { cidr: true }
  }
});

✅ schema.validate("127.0.0.1/24");

❌ schema.validate("");
❌ schema.validate("127.0.0.1");
```

**Validate strings using multiple testers**

```ts
const schema = new Schema({
  type: "string",
  constraint: {
    isEmail: true,
    isIp: { cidr: true }
  }
});

✅ schema.validate("foo@bar.com");
✅ schema.validate("127.0.0.1/24");

❌ schema.validate("");
❌ schema.validate("foo@");
❌ schema.validate("127.0.0.1");
```

### Boolean

#### **Properties:**

<ul>
  <li><strong>type: "boolean"</strong></li>
  <br/>
  <li>
    <strong>literal?</strong>
    <br/>
    Restricts the value to a single valid boolean state.
  </li>
  <br/>
  <li>
    <strong>custom(value)?</strong>
    <br/>
    Custom validation function that receives the value as a parameter and must return a boolean indicating whether it is valid.
  </li>
</ul>

#### **Examples:**

**Validate any boolean**

```ts
const schema = new Schema({
  type: "boolean"
});

✅ schema.validate(true);
✅ schema.validate(false);

❌ schema.validate("");
❌ schema.validate({});
```

**Validate a specific boolean**

```ts
const schema = new Schema({
  type: "boolean",
  literal: true
});

✅ schema.validate(true);

❌ schema.validate("");
❌ schema.validate({});
❌ schema.validate(false);
```

### Object

#### **Properties:**

<ul>
  <li><strong>type: "object"</strong></li>
  <br/>
  <li>
    <strong>nature?</strong> — (Default: <strong>"STANDARD"</strong>)
    <ul>
      <li>
        <strong>"STANDARD"</strong>: Accepts any value of type <strong>object</strong>, that is, any value for which <strong>typeof value === "object"</strong>.
      </li>
      <li>
        <strong>"PLAIN"</strong>: Accepts only plain objects whose prototype is either <strong>Object.prototype</strong> (e.g. created via <strong>{}</strong>) or <strong>null</strong> (created via <strong>Object.create(null)</strong>).
      </li>
    </ul>
  </li>
  <br/>
  <li>
    <strong>min?</strong>
    <br/>
    Minimum number of properties.
  </li>
  <br/>
  <li>
    <strong>max?</strong>
    <br/>
    Maximum number of properties.
  </li>
  <br/>
  <li>
    <strong>shape?</strong>
    <br/>
    An object whose keys are of type <strong>string</strong> or <strong>symbol</strong>, and whose values are criteria nodes. Represents fixed properties that the object must satisfy.
  </li>
  <br/>
  <li>
    <strong>optional?</strong> — (Default: <strong>false</strong> | Only usable if <strong>shape</strong> is defined)
    <ul>
      <li>
        <strong>boolean</strong>
        <ul>
          <li><strong>true</strong>: All properties defined in the <strong>shape</strong> object are optional.</li>
          <li><strong>false</strong>: All properties defined in the <strong>shape</strong> object are required.</li>
        </ul>
      </li>
      <li>
        <strong>array</strong>
        <br/>
        An array whose elements are keys of the <strong>shape</strong> object that should be optional.
      </li>
    </ul>
  </li>
  <br/>
  <li>
    <strong>keys?</strong>
    <br/>
    Criteria node that object keys must satisfy.<br/>
    Keys defined in the <strong>shape</strong> object are not affected.
  </li>
  <br/>
  <li>
    <strong>values?</strong>
    <br/>
    Criteria node that object values must satisfy.<br/>
    Values defined in the <strong>shape</strong> object are not affected.
  </li>
</ul>

#### **Examples:**

**Validate any object**
```ts
const schema = new Schema({
  type: "object"
});

✅ schema.validate({});
✅ schema.validate([]);
✅ schema.validate(new Date());
✅ schema.validate(Object.create(null));

❌ schema.validate("");
```

**Validate a plain object**

```ts
const schema = new Schema({
  type: "object",
  nature: "PLAIN"
});

✅ schema.validate({});
✅ schema.validate(Object.create(null));

❌ schema.validate("");
❌ schema.validate([]);
❌ schema.validate(new Date());
```

**Validate an object with fixed properties**

```ts
const schema = new Schema({
  type: "object",
  shape: {
    foo: { type: "string" },
    bar: { type: "string" }
  }
});

✅ schema.validate({ foo: "x", bar: "x" });

❌ schema.validate({});
❌ schema.validate({ foo: "x" });
❌ schema.validate({ bar: "x" });
❌ schema.validate({ foo: "x", bar: "x", a: "" });
```

**Validate an object with nested fixed properties**

```ts
const schema = new Schema({
  type: "object",
  shape: {
    foo: { type: "string" },
    bar: { type: "string" },
    baz: {
      foo: { type: "number" },
      bar: { type: "number" }
    }
  }
});

✅ schema.validate({ foo: "x", bar: "x", baz: { foo: 0, bar: 0 } });

❌ schema.validate({});
❌ schema.validate({ foo: "x" });
❌ schema.validate({ foo: "x", bar: "x" });
❌ schema.validate({ foo: "x", bar: "x", baz: {} });
❌ schema.validate({ foo: "x", bar: "x", baz: { foo: 0 } });
```

**Validate an object with optional properties**

```ts
const schema = new Schema({
  type: "object",
  shape: {
    foo: { type: "string" },
    bar: { type: "string" }
  },
  optional: true
});

✅ schema.validate({});
✅ schema.validate({ foo: "x" });
✅ schema.validate({ bar: "x" });
✅ schema.validate({ foo: "x", bar: "x" });

❌ schema.validate({ foo: "x", bar: "x", a: "x" });
```

**Validate an object with one fixed and one optional property**

```ts
const schema = new Schema({
  type: "object",
  shape: {
    foo: { type: "string" },
    bar: { type: "string" }
  },
  optional: ["bar"]
});

✅ schema.validate({ foo: "x" });
✅ schema.validate({ foo: "x", bar: "x" });

❌ schema.validate({});
❌ schema.validate({ bar: "x" });
❌ schema.validate({ foo: "x", bar: "x", a: "x" });
```

**Validate an object with fixed and dynamic free properties**

```ts
const schema = new Schema({
  type: "object",
  shape: {
    foo: { type: "string" },
    bar: { type: "string" }
  },
  values: { type: "unknown" }
});

✅ schema.validate({ foo: "x", bar: "x" });
✅ schema.validate({ foo: "x", bar: "x", a: "x", b: 0 });

❌ schema.validate({});
❌ schema.validate({ bar: "x" });
❌ schema.validate({ foo: "x" });
```

**Validate an object with fixed and constrained dynamic properties**

```ts
const schema = new Schema({
  type: "object",
  shape: {
    foo: { type: "string" },
    bar: { type: "string" }
  },
  keys: { type: "string" },
  values: { type: "number" }
});

✅ schema.validate({ foo: "x", bar: "x" });
✅ schema.validate({ foo: "x", bar: "x", a: 0 });
✅ schema.validate({ foo: "x", bar: "x", a: 0, b: 0 });

❌ schema.validate({});
❌ schema.validate({ foo: "x" });
❌ schema.validate({ bar: "x" });
❌ schema.validate({ foo: "x", bar: "x", a: "x", b: 0 });
```

**Validate an object with constrained dynamic properties**

```ts
const schema = new Schema({
  type: "object",
  keys: { type: "string" },
  values: { type: "string" }
});

✅ schema.validate({});
✅ schema.validate({ a: "x" });
✅ schema.validate({ a: "x", b: "x" });

❌ schema.validate({ a: 0 });
❌ schema.validate({ a: "x", b: 0 });
```

### Array

#### **Properties:**

<ul>
  <li><strong>type: "array"</strong></li>
  <br/>
  <li>
    <strong>min?</strong>
    <br/>
    Minimum number of elements.
  </li>
  <br/>
  <li>
    <strong>max?</strong>
    <br/>
    Maximum number of elements.
  </li>
  <br/>
  <li>
    <strong>tuple?</strong>
    <br/>
    An array whose elements are criteria nodes. Represents fixed elements the array must satisfy.
  </li>
  <br/>
  <li>
    <strong>items?</strong>
    <br/>
    Criteria node that array elements must satisfy.<br/>
    Elements defined in the <strong>tuple</strong> array are not affected.
  </li>
</ul>

#### **Examples:**

**Validate any array**

```ts
const schema = new Schema({
  type: "array"
});

✅ schema.validate([]);
✅ schema.validate(["x"]);

❌ schema.validate({});
❌ schema.validate("x");
```

**Validate an array with fixed elements**

```ts
const schema = new Schema({
  type: "array",
  tuple: [
    { type: "string" },
    { type: "string" }
  ]
});

✅ schema.validate(["x", "x"]);

❌ schema.validate([]);
❌ schema.validate(["x"]);
❌ schema.validate(["x", "x", "x"]);
```

**Validate a nested array with fixed elements**

```ts
const schema = new Schema({
  type: "array",
  tuple: [
    { type: "string" },
    { type: "string" },
    [
      { type: "number" },
      { type: "number" }
    ]
  ]
});

✅ schema.validate(["x", "x", [0, 0]]);

❌ schema.validate([]);
❌ schema.validate(["x"]);
❌ schema.validate(["x", "x", []]);
❌ schema.validate(["x", "x", [0]]);
```

**Validate an array with fixed and free dynamic elements**

```ts
const schema = new Schema({
  type: "array",
  tuple: [
    { type: "string" },
    { type: "string" }
  ],
  items: { type: "unknown" }
});

✅ schema.validate(["x", "x"]);
✅ schema.validate(["x", "x", 0]);
✅ schema.validate(["x", "x", ""]);
✅ schema.validate(["x", "x", {}]);

❌ schema.validate([]);
❌ schema.validate(["x"]);
❌ schema.validate([0, "x"]);
```

**Validate an array with fixed and constrained dynamic elements**

```ts
const schema = new Schema({
  type: "array",
  tuple: [
    { type: "string" },
    { type: "string" }
  ],
  items: { type: "number" }
});

✅ schema.validate(["x", "x"]);
✅ schema.validate(["x", "x", 0]);
✅ schema.validate(["x", "x", 0, 0]);

❌ schema.validate([]);
❌ schema.validate(["x"]);
❌ schema.validate(["x", "x", "x"]);
```

**Validate an array with constrained dynamic elements**

```ts
const schema = new Schema({
  type: "array",
  items: { type: "string" }
});

✅ schema.validate([]);
✅ schema.validate(["x"]);
✅ schema.validate(["x", "x"]);

❌ schema.validate([0]);
❌ schema.validate(["x", 0]);
❌ schema.validate(["x", "x", 0]);
```

### Symbol

#### **Properties:**

<ul>
  <li><strong>type: "symbol"</strong></li>
  <br/>
  <li>
    <strong>literal?</strong>
    <br/>
    <ul>
      <li><strong>symbol</strong>: Restricts the value to a single valid symbol.</li>
      <li><strong>array</strong>: Restricts the value to an array of valid symbols.</li>
      <li><strong>object</strong>: Restricts the value to an object whose values represent valid symbols.</li>
    </ul>
  </li>
  <br/>
  <li>
    <strong>custom(value)?</strong>
    <br/>
    Custom validation function that receives the value as a parameter and must return a boolean indicating whether it is valid.
  </li>
</ul>

#### **Examples:**

**Validate any symbol**

```ts
const xSymbol = Symbol("x");
const ySymbol = Symbol("y");

const schema = new Schema({
  type: "symbol"
});

✅ schema.validate(xSymbol);
✅ schema.validate(ySymbol);
```

**Validate a specific symbol**

```ts
const xSymbol = Symbol("x");
const ySymbol = Symbol("y");

const schema = new Schema({
  type: "symbol",
  literal: xSymbol
});

✅ schema.validate(xSymbol);

❌ schema.validate(ySymbol);
```

**Validate specific symbols using an array**

```ts
const xSymbol = Symbol("x");
const ySymbol = Symbol("y");
const zSymbol = Symbol("z");

const schema = new Schema({
  type: "symbol",
  literal: [xSymbol, ySymbol]
});

✅ schema.validate(xSymbol);
✅ schema.validate(ySymbol);

❌ schema.validate(zSymbol);
```

**Validate specific symbols using an enum**

```ts
enum mySymbol {
  X = Symbol("x"),
  Y = Symbol("y")
};

enum otherSymbol {
  Z = Symbol("z")
};

const schema = new Schema({
  type: "symbol",
  literal: mySymbol
});

✅ schema.validate(mySymbol.X);
✅ schema.validate(mySymbol.Y);

❌ schema.validate(otherSymbol.Z);
```

### Union

#### **Properties:**

<ul>
  <li>
    <strong>union</strong>
    <br/>
    An array of criteria nodes, where each node defines an acceptable value.<br/>
    A value is considered valid if it matches at least one of the provided nodes.
  </li>
</ul>

#### **Examples:**

```ts
const schema = new Schema({
  type: "union",
  union: [
    { type: "string" },
    { type: "number" }
  ]
});

✅ schema.validate(0);
✅ schema.validate("");

❌ schema.validate({});
```

### Null

#### **Properties:**

<ul>
  <li><strong>type: "null"</strong></li>
</ul>

#### **Examples:**

```ts
const schema = new Schema({
  type: "null"
});

✅ schema.validate(null);

❌ schema.validate(0);
❌ schema.validate("");
❌ schema.validate({});
```

### Undefined

#### **Properties:**

<ul>
  <li><strong>type: "undefined"</strong></li>
</ul>

#### **Examples:**

```ts
const schema = new Schema({
  type: "undefined"
});

✅ schema.validate(undefined);

❌ schema.validate(0);
❌ schema.validate("");
❌ schema.validate({});
```

<a id="schema-examples"></a>

## Examples

### Simple schema

```ts
const user = new Schema({ 
  type: "object",
  shape: {
    name: {
      type: "string",
      min: 3,
      max: 32
    },
    role: {
      type: "string",
      literal: ["WORKER", "CUSTOMER"]
    }
  }
});

✅ user.validate({
  name: "Alice",
  role: "WORKER"
});

❌ user.validate({
  name: "Alice",
  role: "MANAGER"
});
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
  literal: ["WORKER", "CUSTOMER"]
});

const user = new Schema({ 
  type: "object",
  shape: {
    name: name.criteria,
    role: role.criteria
  }
});

✅ user.validate({
  name: "Bob",
  role: "CUSTOMER"
});

❌ user.validate({
  name: "Bob",
  role: "MANAGER"
});
```

### Deep composite schema

```ts
const name = new Schema({
  type: "string",
  min: 3,
  max: 32
});

const setting = new Schema({
  type: "object",
  shape: {
    theme: {
      type: "string",
      literal: ["DARK", "LIGHT"]
    },
    notification: { type: "boolean" }
  }
});

const user = new Schema({ 
  type: "object",
  object: {
    name: name.criteria,
    theme: setting.criteria.shape.theme
  }
});

✅ user.validate({
  name: "Alice",
  theme: "DARK"
});

❌ user.validate({
  name: "Alice",
  theme: "DEFAULT"
});
```

<br/><br/>

<a id="testers"></a>

# Testers

<a id="testers-object"></a>

## Object

#### `isObject(value): boolean`

Checks if the provided value is of type **object**.

#### `isPlainObject(value): boolean`

Checks if the provided value is an **object** whose prototype is either **Object.prototype** or **null**.
For example, values created using the literal **{}** or **Object.create(null)** are accepted.

#### `isArray(value): boolean`

Checks if the provided value is an **array**.

#### `isTypedArray(value): boolean`

Checks if the provided value is a **typed array**, i.e., a view on an **ArrayBuffer**, except for **DataView**.

#### `isFunction(value): boolean`

Checks if the provided value is a **function**.

#### `isBasicFunction(value): boolean`

Checks if the provided value is a **function** that is **not async**, **generator**, or **async generator**.

#### `isAsyncFunction(value): boolean`

Checks if the provided value is an **async function**.

#### `isGeneratorFunction(value): boolean`

Checks if the provided value is a **generator function**.

#### `isAsyncGeneratorFunction(value): boolean`

Checks if the provided value is an **async generator function**.

<br/>

<a id="testers-string"></a>

## String

#### `isAscii(str): boolean`

Checks if the provided string contains only ASCII characters.

#### `isIpV4(str [, options]): boolean`

Checks if the provided string is a valid IPv4 address.

#### `isIpV6(str [, options]): boolean`

Checks if the provided string is a valid IPv6 address.

#### `isIp(str [, options]): boolean`

Checks if the provided string is a valid IPv4 or IPv6 address.

**Options:**

<ul>
  <li>
    <strong>cidr?</strong> — (Default: <strong>false</strong>)
    <br/>
    If <strong>true</strong>, requires a CIDR suffix.  
    If <strong>false</strong>, CIDR suffixes are not allowed.
  </li>
</ul>

#### `isEmail(str [, options]): boolean`

Checks if the provided string is a valid email address.

**Options:**

<ul>
  <li>
    <strong>allowLocalQuotes?: boolean</strong> — (Default: <strong>false</strong>)
    <br/>
    Specifies whether the local part of the email can use quotes.  
    For example, <strong>"John Doe"@example.com</strong> would be considered valid.
  </li>
  <li>
    <strong>allowIpAddress?: boolean</strong> — (Default: <strong>false</strong>)
    <br/>
    Specifies whether the domain part of the email can be an IP address.  
    For example, <strong>foo@8.8.8.8</strong> would be valid.
  </li>
  <li>
    <strong>allowGeneralAddress?: boolean</strong> — (Default: <strong>false</strong>)
    <br/>
    Specifies whether the domain part of the email can be a general address.  
    For example, <strong>foo@server</strong> would be valid.
  </li>
</ul>

**Standard:** RFC 5321

#### `isDomain(str): boolean`

Checks if the provided string is a valid domain name.

**Standard:** RFC 1035

#### `isDataURL(str [, options]): boolean`

Checks if the provided string is a valid **DataURL**.

**Options:**

<ul>
  <li>
    <strong>type?: string[]</strong>
    <br/>
    Specifies one or more allowed MIME types.  
    <a href="http://www.iana.org/assignments/media-types/">List of IANA-registered MIME types ↗</a>
  </li>
  <li>
    <strong>subtype?: string[]</strong>
    <br/>
    Specifies one or more allowed MIME subtypes.  
    <a href="http://www.iana.org/assignments/media-types/">List of IANA-registered MIME types ↗</a>
  </li>
</ul>

**Standard:** RFC 2397

#### `isUuid(str [, options]): boolean`

Checks if the provided string is a valid **UUID**.

**Options:**

<ul>
  <li>
    <strong>version?: number</strong>
    <br/>
    Specifies the allowed version number, between 1 and 7.
  </li>
</ul>

**Standard:** RFC 9562

#### `isBase16(str): boolean`

Checks if the provided string is a valid **base16** encoding.

**Standard:** RFC 4648

#### `isBase32(str): boolean`

Checks if the provided string is a valid **base32** encoding.

**Standard:** RFC 4648

#### `isBase32Hex(str): boolean`

Checks if the provided string is a valid **base32Hex** encoding.

**Standard:** RFC 4648

#### `isBase64(str): boolean`

Checks if the provided string is a valid **base64** encoding.

**Standard:** RFC 4648

#### `isBase64Url(str): boolean`

Checks if the provided string is a valid **base64Url** encoding.

**Standard:** RFC 4648

<br/><br/>

<a id="helpers"></a>

# Helpers

<a id="helpers-string"></a>

## String

#### `base16ToBase32(str [, to, padding]): string`

Converts a **base16** string into a **base32** or **base32Hex** string.

**Arguments:**

<ul>
  <li>
    <strong>to?: "B32" | "B32HEX"</strong> — (Default: <strong>"B32"</strong>)
    <br/>
    Specifies the target encoding format.
  </li>
  <br/>
  <li>
    <strong>padding?: boolean</strong> — (Default: <strong>true</strong>)
    <br/>
    Specifies whether padding should be added if required.
  </li>
</ul>

**Standard:** RFC 4648

#### `base16ToBase64(str [, to, padding]): string`

Converts a **base16** string into a **base64** or **base64Url** string.

**Arguments:**

<ul>
  <li>
    <strong>to?: "B64" | "B64URL"</strong> — (Default: <strong>"B64"</strong>)
    <br/>
    Specifies the target encoding format.
  </li>
  <br/>
  <li>
    <strong>padding?: boolean</strong> — (Default: <strong>true</strong>)
    <br/>
    Specifies whether padding should be added if required.
  </li>
</ul>

**Standard:** RFC 4648

#### `base32ToBase16(str [, from]): string`

Converts a **base32** or **base32Hex** string into a **base16** string.

**Arguments:**

<ul>
  <li>
    <strong>from?: "B32" | "B32HEX"</strong> — (Default: <strong>"B32"</strong>)
    <br/>
    Specifies the source encoding format.
  </li>
</ul>

**Standard:** RFC 4648

#### `base64ToBase16(str [, from]): string`

Converts a **base64** or **base64Url** string into a **base16** string.

**Arguments:**

<ul>
  <li>
    <strong>from?: "B64" | "B64URL"</strong> — (Default: <strong>"B64"</strong>)
    <br/>
    Specifies the source encoding format.
  </li>
</ul>

<a id="helpers-object"></a>

## Object

#### `getInternalTag(target): string`

Returns the internal tag of the target.
For example, for **async () => {}**, the returned tag would be **"AsyncFunction"**.

<br/>
