# ![logo-valia-h64-v2](https://github.com/user-attachments/assets/ea937a53-9b80-43d7-93ac-81538d9526f8) · [![npm version](https://img.shields.io/npm/v/valia.svg?style=flat)](https://www.npmjs.com/package/valia)

Bibliothèque de validation légère et moderne pour TypeScript et JavaScript.

🔌 S’intègre naturellement à vos projets, qu’ils soient front-end ou back-end, et permet de définir des schémas de manière intuitive tout en favorisant leur réutilisation.

💡 Pensée pour allier simplicité et puissance, elle propose des fonctionnalités avancées comme l’inférence de types, ainsi que des validateurs standards tels que **isEmail**, **isUuid** ou **isIp**.

## Table des matières

- [Schema](#schema)
  - [Instances](#instances)
  - [Formats](#formats)
  - [Exemples](#exemples)
- [Testers](#testers)
  - [Object](#object)
  - [String](#string-1)
- [Helpers](#helpers)
  - [Object](#object-1)
  - [String](#string-2)


## Installation

```
> npm install valia
```

```ts
import type { SchemaInfer } from 'valia';
import { Schema } from 'valia';

const user = new Schema({ 
  type: "object",
  shape: {
    name: { type: "string" },
    role: {
      type: "string",
      literal: ["WORKER", "CUSTOMER"]
    }
  }
});

type User = SchemaInfer<typeof user>;

let mock: User = {
  name: "Alice",
  role: "WORKER"
};

if (user.validate(mock)) {
  console.log(mock.name, mock.role);
}
```

<br/>

# Schema

## Instances

### Schema

`new Schema(criteria: SetableCriteria): Schema;`

<ul>
  <li>
    <strong>criteria</strong>
    <br/>
    Propriété représentant la racine des noeuds de critères montés.
  </li>
  <li>
    <strong>validate(data)</strong>
    <br/>
    Valide les données fournies selon le schéma et retourne un booléen. Si elle renvoie <strong>true</strong>, TypeScript considère que les données sont du type défini par le schéma.
    <br/>
    <a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates">En savoir plus sur la prédiction de types ↗</a>
  </li>
  <li>
    <strong>evaluate(data)</strong>
    <br/>
    Valide les données fournies selon le schéma et retourne un objet avec les propriétés suivantes :
    <ul>
      <li>
        <strong>rejection</strong>: Instance de <strong>SchemaDataRejection</strong> si les données sont rejetées sinon <strong>null</strong>.
      </li>
      <li>
        <strong>data</strong>: Données passées en paramètre de la fonction si celles-ci sont acceptées sinon <strong>null</strong>.
      </li>
    </ul>
  </li>
</ul>

### SchemaException

<ul>
  <li>
    <strong>code</strong>
    <br/>
    Code de rejet (e.g. <strong>"REGEXP_"</strong>, <strong>"REGEX_UNSATISFIED"</strong>).
  </li>
  <li>
    <strong>message</strong>
    <br/>
    Message défini sur le noeud ayant émis le rejet ou <strong>undefined</strong> si le message n'a pas été spécifié.
  </li>
</ul>

### SchemaNodeException

<ul>
  <li>
    <strong>code</strong>
    <br/>
    Code de rejet du noeud de critères (e.g. <strong>"MIN_PROPERTY_MALFORMED"</strong>, <strong>"REGEX_PROPERTY_MALFORMED"</strong>).
  </li>
  <li>
    <strong>label</strong>
    <br/>
    Label défini sur le noeud de critères ayant émis l'exception ou <strong>undefined</strong> si le label n'a pas été spécifié.
  </li>
  <li>
    <strong>message</strong>
    <br/>
    Message défini sur le noeud  de critères ayant émis l'exception ou <strong>undefined</strong> si le message n'a pas été spécifié.
  </li>
  <li>
    <strong>node</strong>
    <br/>
    Noeud de critères ayant émis l'exception.
  </li>
  <li>
    <strong>nodePath</strong>
    <ul>
      <li>
        <strong>explicit</strong>: Tableau de segments représentant le chemin du noeud dans l'arbre des critères du schéma.
      </li>
      <li>
        <strong>implicit</strong>: Tableau de segments représentant le chemin du noeud dans l'arbre de données attendues par les critères du schema.
      </li>
    </ul>
  </li>
</ul>

### SchemaDataRejection

<ul>
  <li>
    <strong>code</strong>
    <br/>
    Code de rejet du noeud (e.g. <strong>"MIN_UNSATISFIED"</strong>, <strong>"REGEX_UNSATISFIED"</strong>).
  </li>
  <li>
    <strong>label</strong>
    <br/>
    Label défini sur le noeud ayant émis le rejet ou <strong>undefined</strong> si le label n'a pas été spécifié.
  </li>
  <li>
    <strong>message</strong>
    <br/>
    Message défini sur le noeud ayant émis le rejet ou <strong>undefined</strong> si le message n'a pas été spécifié.
  </li>
  <li>
    <strong>node</strong>
    <br/>
    Noeud ayant émis le rejet.
  </li>
  <li>
    <strong>nodePath</strong>
    <ul>
      <li>
        <strong>explicit</strong>: Tableau de segments représentant le chemin du noeud dans l'arbre des critères du schéma.
      </li>
      <li>
        <strong>implicit</strong>: Tableau de segments représentant le chemin du noeud dans l'arbre de données attendues par les critères du schema.
      </li>
    </ul>
  </li>
</ul>

## Formats

[Number](#number) • [String](#string) • [Boolean](#boolean) • [Object](#object) • [Array](#array) • [Function](#function) • [Symbol](#symbol) • [Simple](#simple) • [Union](#union)

Les formats définissent les types de noeuds disponibles pour les critères d'un schéma.
<br/>
*L'ordre des propriétés décrites ici respecte l'ordre d'exécution.*

### Global

#### **Propriétés :**

<ul>
  <li>
    <strong>label?</strong>
    <br/>
    Une chaine de caratéres permetant d'idantifié le noeud, celle-ci vous sera retournée dans les instance de <strong>SchemaDataRejection</strong> et <strong>SchemaNodeException</strong>.
  </li>
  <li>
    <strong>message?</strong>
    <br/>
    <ul>
      <li><strong>string</strong>: Chaîne de caractères qui vous sera retournée dans les objets de réjection.</li>
      <li><strong>function</strong>: Fonction qui reçoit un objet de rejet en paramètre et doit renvoyer une chaîne de caractères.</li>
    </ul>
  </li>
  <li>
    <strong>nullable?</strong>
    <br/>
    <ul>
      <li><strong>true</strong>: Peu importe le type utilisé pour le noeud, la valeur sera autorisée à être <strong>null</strong>.</li>
      <li><strong>false</strong>: Peu importe le type utilisé pour le noeud, la valeur ne sera pas autorisée à être <strong>null</strong>.</li>
    </ul>
  </li>
</ul>

### Number

#### **Propriétés :**

<ul>
  <li>
    <strong>min?</strong>
    <br/>
    Nombre minimale.
  </li>
  <li>
    <strong>max?</strong>
    <br/>
    Nombre maximale.
  </li>
  <li>
    <strong>literal?</strong>
    <br/>
    <ul>
      <li><strong>string</strong>: Restreint la valeur à une seul nombre valide.</li>
      <li><strong>array</strong>: Restreint la valeur avec un tableau où les items représentent les nombres valides.</li>
      <li><strong>object</strong>: Restreint la valeur avec un objet où les valeurs représentent les nombres valides.</li>
    </ul>
  </li>
  <li>
    <strong>custom(value)?</strong>
    <br/>
    Fonction de validation custom qui reçoit la valeur en paramètre et doit renvoyer un booléen indiquant si la celle-ci est valide.
  </li>
</ul>

#### **Exemples :**

**Validé n'importe quel nombre**
```ts
const schema = new Schema({
  type: "number"
});

✅ schema.validate(0);
✅ schema.validate(10);
✅ schema.validate(-10);
```

**Valide des nombres qui appartiennent à une plage spécifique**
```ts
const schema = new Schema({
  type: "number",
  min: 0,
  max: 10
});

✅ schema.validate(0);
✅ schema.validate(10);

❌ schema.validate(-1);
❌ schema.validate(-10);
```

**Validé un nombre spécifique**
```ts
const schema = new Schema({
  type: "number",
  literal: 141
});

✅ schema.validate(141);

❌ schema.validate(-1);
❌ schema.validate(-10);
```

**Validé des nombres spécifique avec un tableau**
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

#### **Propriétés :**

<ul>
  <li>
    <strong>min?</strong>
    <br/>
    Longueur minimale de la chaîne de caractères.
  </li>
  <li>
    <strong>max?</strong>
    <br/>
    Longueur maximale de la chaîne de caractères.
  </li>
  <li>
    <strong>regex?</strong>
    <br/>
    Une expression régulière fournie sous forme d'objet (<strong>RegExp</strong>).
  </li>
  <li>
    <strong>literal?</strong>
    <br/>
    <ul>
      <li><strong>string</strong>: Restreint la valeur à une seul chaîne de caractères valides.</li>
      <li><strong>array</strong>: Restreint la valeur avec un tableau où les items représentent les chaîne de caractères valides.</li>
      <li><strong>object</strong>: Restreint la valeur avec un objet où les valeurs représentent les chaîne de caractères valides.</li>
    </ul>
  </li>
  <li>
    <strong>constraint?</strong>
    <br/>
    Un objet dont les clés correspondent à des noms de testeurs de chaîne et dont les valeurs possible sont :
    <ul>
      <li><strong>boolean</strong> : active ou désactive le testeur.</li>
      <li><strong>objet</strong> : le testeur est activé avec les options spécifiés dans l'objet.</li>
    </ul>
    La valeur sera considérée comme valide si au moins un testeur renvoie un résultat positif.
  </li>
  <li>
    <strong>custom(value)?</strong>
    <br/>
    Fonction de validation custom qui reçoit la valeur en paramètre et doit renvoyer un booléen indiquant si la celle-ci est valide.
  </li>
</ul>

#### **Exemples :**

**Validé n'importe quel chaîne de caractères**
```ts
const schema = new Schema({
  type: "string"
});

✅ schema.validate("");
✅ schema.validate("abc");
```

**Validé des chaînes de caractères ayant une longueur spécifique**
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

**Validé des chaînes de caractères avec une expression régulière**
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

**Validé une chaîne de caractères spécifique**
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

**Validé des chaînes de caractères spécifique avec un tableau**
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

**Validé des chaînes de caractères avec un testeur de chaîne**
```ts
const schema = new Schema({
  type: "string",
  constraint: {
    idIp: { cidr: true }
  }
});

✅ schema.validate("127.0.0.1/24");

❌ schema.validate("");
❌ schema.validate("127.0.0.1");
```

**Validé des chaînes de caractères avec plusieurs testeurs de chaîne**
```ts
const schema = new Schema({
  type: "string",
  constraint: {
    isEmail: true,
    idIp: { cidr: true }

  }
});

✅ schema.validate("foo@bar");
✅ schema.validate("127.0.0.1/24");

❌ schema.validate("");
❌ schema.validate("foo@");
❌ schema.validate("127.0.0.1");
```


### Boolean

#### **Propriétés :**

<ul>
  <li>
    <strong>literal?</strong>
    <br/>
    Restreint la valeur à un seul état de booléen valide.
  </li>
  <li>
    <strong>custom(value)?</strong>
    <br/>
    Fonction de validation custom qui reçoit la valeur en paramètre et doit renvoyer un booléen indiquant si la celle-ci est valide.
  </li>
</ul>

#### **Exemples :**

**Validé n'importe quel booléen**
```ts
const schema = new Schema({
  type: "boolean"
});

✅ schema.validate(true);
✅ schema.validate(false);

❌ schema.validate("");
❌ schema.validate({});
```

**Validé un booléen avec un état spécifique**
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

#### **Propriétés :**

<ul>
  <li>
    <strong>nature?</strong> — (Default: <strong>"STANDARD"</strong>)
    <ul>
      <li>
        <strong>"STANDARD"</strong>: Accepte toute valeur de type objet, c’est-à-dire tout ce pour quoi <strong>typeof value === "object"</strong>.
      </li>
      <li>
        <strong>"PLAIN"</strong>: Accepte uniquement les objets dont le prototype est
        soit <strong>Object.prototype</strong> (comme les objets créés via <strong>{}</strong>),
        soit <strong>null</strong> (créés via <strong>Object.create(null)</strong>).
      </li>
    </ul>
  </li>
  <br/>
  <li>
    <strong>shape?</strong>
    <br/>
    Un objet dont les clés sont de type <strong>string</strong> ou <strong>symbol</strong> et dont les valeurs sont des noeuds de critères. Représente la forme d'une structure attendu.
  </li>
  <br/>
  <li>
    <strong>optional?</strong> — (Default: <strong>false</strong> | Utilisable seulement si <strong>shape</strong> est défini)
    <ul>
      <li>
        <strong>boolean</strong>
        <ul>
          <li><strong>true</strong>: Toutes les propriétés définies dans l'objet <strong>shape</strong> sont optionnelles.</li>
          <li><strong>false</strong>: Toutes les propriétés définies dans l'objet <strong>shape</strong> sont obligatoires.</li>
        </ul>
      </li>
      <li>
        <strong>array</strong>
        <br/>
        Un tableau dont les éléments représentes des clés de l’objet <strong>shape</strong> qui doivent être considérées comme optionnelles.
      </li>
    </ul>
  </li>
  <br/>
  <li>
    <strong>additional?</strong> — (Default: <strong>false</strong> | Utilisable seulement si <strong>shape</strong> est défini)
    <ul>
      <li>
        <strong>boolean</strong>
        <ul>
          <li><strong>true</strong>: Autorise la présence de propriétés additionnelles en plus de celles de l'objet <strong>shape</strong>.</li>
          <li><strong>false</strong>: N’autorise pas la présence de propriétés additionnelles en plus de celles de l'objet <strong>shape</strong>.</li>
        </ul>
      </li>
      <li>
        <strong>object</strong>
        <br/>
        <ul>
          <li><strong>min?</strong>: Nombre de propriétés additionnelles minimum.</li>
          <li><strong>max?</strong>: Nombre de propriétés additionnelles maximun.</li>
          <li><strong>key?</strong>: Noeud de critères que les clés additionnelles doivent satisfaire.</li>
          <li><strong>value?</strong>: Noeud de critères que les valeurs additionnelles doivent satisfaire.</li>
        </ul>
      </li>
    </ul>
  </li>
</ul>

#### **Exemples :**

**Validé n'importe quel objet standard**
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

**Validé un objet de nature simple**
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

**Validé un objet avec des propriétés fixes**
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

**Validé un objet et un sous-objet avec des propriétés fixes**
<br/>
*Il s'agit d'un raccourci qui convertira les sous-objets de **shape** en noeuds de critères de type **object***.

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

✅ schema.validate({
  foo: "x",
  bar: "x",
  baz: {
    foo: 0,
    bar: 0
  }
});

❌ schema.validate({});
❌ schema.validate({ foo: "x" });
❌ schema.validate({ foo: "x", bar: "x" });
❌ schema.validate({ foo: "x", bar: "x", baz: {} });
❌ schema.validate({ foo: "x", bar: "x", baz: { foo: 0 } });
```

**Validé un objet avec des propriétés facultatives**
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

**Validé un objet avec une propriété fixe et une propriété facultative**
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

**Validé un objet avec des propriétés fixes et autorisé des propriétés additionnels**
```ts
const schema = new Schema({
  type: "object",
  shape: {
    foo: { type: "string" },
    bar: { type: "string" }
  },
  additional: true
});

✅ schema.validate({ foo: "x", bar: "x" });
✅ schema.validate({ foo: "x", bar: "x", a: "x", b: 0 });

❌ schema.validate({});
❌ schema.validate({ bar: "x" });
❌ schema.validate({ foo: "x" });
```

**Validé un objet avec des propriétés fixes et autorisé des propriétés additionnels qui respecte des noeuds de critères**
```ts
const schema = new Schema({
  type: "object",
  shape: {
    foo: { type: "string" },
    bar: { type: "string" }
  },
  additional: {
    key: { type: "string" },
    value: { type: "number" }
  }
});

✅ schema.validate({ foo: "x", bar: "x" });
✅ schema.validate({ foo: "x", bar: "x", a: 0 });
✅ schema.validate({ foo: "x", bar: "x", a: 0, b: 0 });

❌ schema.validate({});
❌ schema.validate({ foo: "x" });
❌ schema.validate({ bar: "x" });
❌ schema.validate({ foo: "x", bar: "x", a: "x", b: 0 });
```

### Array

#### **Propriétés :**

<ul>
  <li>
    <strong>shape?</strong>
    <br/>
    Un tableau dont les éléments sont des noeuds de critères. Représente la forme d’un uplet attendu.
  </li>
  <br/>
  <li>
    <strong>additional?</strong> — (Default: <strong>false</strong> | Utilisable seulement si <strong>shape</strong> est défini)
    <ul>
      <li>
        <strong>boolean</strong>
        <ul>
          <li><strong>true</strong>: Autorise la présence d’éléments additionnelles à la suite de <strong>shape</strong>.</li>
          <li><strong>false</strong>: N’autorise pas la présence d’éléments additionnelles à la suite de <strong>shape</strong>.</li>
        </ul>
      </li>
      <li>
        <strong>object</strong>
        <br/>
        <ul>
          <li><strong>min?</strong>: Nombre d'éléments additionnelles minimum.</li>
          <li><strong>max?</strong>: Nombre d'éléments additionnelles maximun.</li>
          <li><strong>item?</strong>: Noeud de critères que les éléments additionnelles doivent satisfaire.</li>
        </ul>
      </li>
    </ul>
  </li>
</ul>

#### **Exemples :**

**Validé n'importe quel tableau standard**
```ts
const schema = new Schema({
  type: "array"
});

✅ schema.validate([]);
✅ schema.validate(["x"]);

❌ schema.validate({});
❌ schema.validate("x");
```

**Validé un tableau d'éléments fixes**
```ts
const schema = new Schema({
  type: "array",
  shape: [
    { type: "string" },
    { type: "string" }
  ]
});

✅ schema.validate(["x", "x"]);

❌ schema.validate([]);
❌ schema.validate(["x"]);
❌ schema.validate(["x", "x", "x"]);
```

**Validé un tableau et un sous-tableau d'éléments fixes**
<br/>
*Il s'agit d'un raccourci qui convertira les sous-tableaux de **shape** en noeuds de critères de type **array***.

```ts
const schema = new Schema({
  type: "array",
  shape: [
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

**Validé un tableau d'éléments fixes et autorisé des éléments additionnels**
```ts
const schema = new Schema({
  type: "array",
  shape: [
    { type: "string" },
    { type: "string" }
  ],
  additional: true
});

✅ schema.validate(["x", "x"]);
✅ schema.validate(["x", "x", "x"]);
✅ schema.validate(["x", "x", "x", 0]);

❌ schema.validate([]);
❌ schema.validate(["x"]);
```

**Validé un tableau d'éléments fixes et autorisé des éléments additionnels qui respecte un noeud de critères**
```ts
const schema = new Schema({
  type: "array",
  shape: [
    { type: "string" },
    { type: "string" }
  ],
  additional: {
    item: { type: "number" }
  }
});

✅ schema.validate(["x", "x"]);
✅ schema.validate(["x", "x", 0]);
✅ schema.validate(["x", "x", 0, 0]);

❌ schema.validate([]);
❌ schema.validate(["x"]);
❌ schema.validate(["x", "x", "x"]);
```


### Symbol

#### **Propriétés :**

<ul>
  <li>
    <strong>literal?</strong>
    <br/>
    <ul>
      <li><strong>symbol</strong>: Restreint la valeur à un seul symbole valide.</li>
      <li><strong>array</strong>: Restreint la valeur avec un tableau où les items représentent les symboles valides.</li>
      <li><strong>object</strong>: Restreint la valeur avec un objet où les valeurs représentent les symboles valides.</li>
    </ul>
  </li>
  <br/>
  <li>
    <strong>custom(value)?</strong>
    <br/>
    Fonction de validation custom qui reçoit la valeur en paramètre et doit renvoyer un booléen indiquant si la celle-ci est valide.
  </li>
</ul>

#### **Exemples :**

**Validé n'importe quel symbole**
```ts
const xSymbol = Symbol("x");
const ySymbol = Symbol("y");

const schema = new Schema({
  type: "symbol"
});

✅ schema.validate(xSymbol);
✅ schema.validate(ySymbol);
```

**Validé un symbole spécifique**
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

**Validé des symboles spécifiques avec un tableau**
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

**Validé des symboles spécifiques avec un enum**
```ts
enum mySymbol {
  X = Symbol("x"),
  Y = Symbol("y"),
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


### Simple

#### **Propriétés :**

<ul>
  <li>
    <strong>simple</strong>
    <br/>
     <ul>
      <li><strong>"NULL"</strong>: La valeur doit être égale à <strong>null</strong>.</li>
      <li><strong>"UNDEFINED"</strong>: La valeur doit être égale à <strong>undefined</strong>.</li>
      <li><strong>"NULLISH"</strong>: La valeur doit être égale à <strong>null</strong> ou <strong>undefined</strong>.</li>
      <li><strong>"UNKNOWN"</strong>: Toute valeur est acceptée sans aucune contrainte.</li>
    </ul>
  </li>
</ul>

#### **Exemples :**

```ts
const schema = new Schema({
  type: "simple",
  simple: "NULL"
});

✅ schema.validate(null);

❌ schema.validate(0);
❌ schema.validate("");
❌ schema.validate({});
```

### Union

#### **Propriétés :**

<ul>
  <li>
    <strong>union</strong>
    <br/>
    Un tableau de noeuds de critères, où chaque noeud définit une valeur acceptable.<br/>
    Une valeur est considérée comme valide si elle correspond à au moins un des noeuds de critères fournis.
  </li>
</ul>

#### **Exemples :**

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

## Exemples

### Schéma simple

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

### Schéma composite

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

### Schéma composite profond

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

# Testers

## Object

#### `isObject(value): boolean`
Vérifie si la valeur fournie est de type **object**.

#### `isPlainObject(value): boolean`
Vérifie si la valeur fournie est de type **object** et dont le prototype est soit **Object.prototype**, soit **null**.
<br/>Par exemple les valeurs créées via le littérale **{}** ou via **Object.create(null)** font partie des valeurs acceptées.

#### `isArray(value): boolean`
Vérifie si la valeur fournie est de type **array**.

#### `isTypedArray(value): boolean`
Vérifie si la valeur fournie est de type **array** et si elle est une vue sur un **ArrayBuffer**, à l’exception des **DataView**.

#### `isFunction(value): boolean`
Vérifie si la valeur fournie est de type **function**.

#### `isBasicFunction(value): boolean`
Vérifie si la valeur fournie est de type **function** et qu'elle n'est pas de nature **async**, **generator** ou **async generator**.

#### `isAsyncFunction(value): boolean`
Vérifie si la valeur fournie est de type **function** et qu'elle n'est pas de nature **basic**, **generator** ou **async generator**.

#### `isGeneratorFunction(value): boolean`
Vérifie si la valeur fournie est de type **function** et qu'elle n'est pas de nature **basic**, **async** ou **async generator**.

#### `isAsyncGeneratorFunction(value): boolean`
Vérifie si la valeur fournie est de type **function** et qu'elle n'est pas de nature **basic**, **async** ou **generator**.

<br/>

## String

#### `isAscii(str): boolean`
Vérifie si la chaîne fournie n'est composée que de caractères ASCII. 

#### `isIpV4(str [, options]): boolean`
Vérifie si la chaîne fournie correspond à une IPV4.

#### `isIpV6(str [, options]): boolean`
Vérifie si la chaîne fournie correspond à une IPV6.

#### `isIp(str [, options]): boolean`
Vérifie si la chaîne fournie correspond à une IPV4 ou une IPV6.

**Options:**
<ul>
  <li>
    <strong>cidr?</strong> — (Default: <strong>false</strong>)
    <br/>
    Si <strong>true</strong>, rend obligatoire la présence d'un suffixe CIDR, sinon si <strong>false</strong> un suffixe n'est pas accepté.
  </li>
</ul>

#### `isEmail(str [, options]): boolean`
Vérifie si la chaîne fournie correspond à une adresse email.

**Options:**
<ul>
  <li>
    <strong>allowLocalQuotes?: boolean</strong> — (Default: <strong>false</strong>)
    <br/>
    Spécifie si la première partie (partie locale) de l'adresse email peut être formée à l'aide de guillemets. Par exemple, <strong>"Jean Dupont"@exemple.com</strong> sera considéré comme valide.
  </li>
  <li>
    <strong>allowIpAddress?: boolean</strong> — (Default: <strong>false</strong>)
    <br/>
    Spécifie si la deuxième partie (partie domain) de l'adresse email peut être une adresse IP. Par exemple, <strong>foo@8.8.8.8</strong> sera considéré comme valide.
  </li>
  <li>
    <strong>allowGeneralAddress?: boolean</strong> — (Default: <strong>false</strong>)
    <br/>
    Spécifie si la deuxième partie (partie domain) de l'adresse email peut être une adresse general. Par exemple, <strong>foo@8.8.8.8</strong> sera considéré comme valide.
  </li>
</ul>

**Standards:** RFC 5321

#### `isDomain(str): boolean`
Vérifie si la chaîne fournie correspond un nom de domain.

**Standards:** RFC 1035

#### `isDataURL(str [, options]): boolean`
Vérifie si la chaîne fournie correspond à une **DataURL**.

**Options:**
<ul>
  <li>
    <strong>type?: string[]</strong>
    <br/>
    Spécifie un ou plusieurs types MIME autorisés.
    <br/>
    <a href="http://www.iana.org/assignments/media-types/">Liste des types MIME enregistrés par l'IANA ↗</a>
  </li>
  <li>
    <strong>subtype?: string[]</strong>
    <br/>
    Spécifie un ou plusieurs sous-types MIME autorisés.
    <br/>
    <a href="http://www.iana.org/assignments/media-types/">Liste des types MIME enregistrés par l'IANA ↗</a>
  </li>
</ul>

**Standards:** RFC 2397

#### `isUuid(str [, options]): boolean`
Vérifie si la chaîne fournie correspond à un **UUID** valide.

**Options:**
<ul>
  <li>
    <strong>version?: number</strong>
    <br/>
    Spécifie le numéro de version autorisé, compris entre 1 et 7.
  </li>
</ul>

**Standards:** RFC 9562

#### `isBase16(str): boolean`
Vérifie si la chaîne fournie correspond à un encodage **base16** valide.

**Standards:** RFC 4648

#### `isBase32(str): boolean`
Vérifie si la chaîne fournie correspond à un encodage **base32** valide.

**Standards:** RFC 4648

#### `isBase32Hex(str): boolean`
Vérifie si la chaîne fournie correspond à un encodage **base32Hex** valide.

**Standards:** RFC 4648

#### `isBase64(str): boolean`
Vérifie si la chaîne fournie correspond à un encodage **base64** valide.

**Standards:** RFC 4648

#### `isBase64Url(str): boolean`
Vérifie si la chaîne fournie correspond à un encodage **base64Url** valide.

**Standards:** RFC 4648

<br/><br/>

# Helpers

## Object

#### `getInternalTag(target): string`
Retourne le tag interne de la cible. Par exemple pour une cible **async () => {}** le tag retourné est **"AsyncFunction"**.

<br/>

## String

#### `base16ToBase32(str [, to, padding]): string`
Convertie une chaîne en **base16** en une chaîne en **base32** ou **base32Hex**.

**Arguments:**
<ul>
  <li>
    <strong>to?: "B32" | "B32HEX"</strong> — (Default: <strong>"B32"</strong>)
    <br/>
    Spécifie dans quel encodage la chaîne doit être convertie.
  </li>
  <br/>
  <li>
    <strong>padding?: boolean</strong> — (Default: <strong>true</strong>)
    <br/>
    Spécifie si la chaîne doit être complétée par un remplissage si nécessaire.
  </li>
</ul>

**Standards:** RFC 4648

#### `base16ToBase64(str [, to, padding]): string`
Convertie une chaîne en **base16** en une chaîne en **base64** ou **base64Url**.

**Arguments:**
<ul>
  <li>
    <strong>to?: "B64" | "B64URL"</strong> — (Default: <strong>"B64"</strong>)
    <br/>
    Spécifie dans quel encodage la chaîne doit être convertie.
  </li>
  <br/>
  <li>
    <strong>padding?: boolean</strong> — (Default: <strong>true</strong>)
    <br/>
    Spécifie si la chaîne doit être complétée par un remplissage si nécessaire.
  </li>
</ul>

**Standards:** RFC 4648

#### `base32ToBase16(str [, from]): string`
Convertie une chaîne en **base32** ou **base32Hex** en une chaîne en **base16**.

**Arguments:**
<ul>
  <li>
    <strong>from?: "B32" | "B32HEX"</strong> — (Default: <strong>"B32"</strong>)
    <br/>
    Spécifie dans quel encodage la chaîne doit être fournie.
  </li>
</ul>

**Standards:** RFC 4648

#### `base64ToBase16(str [, from]): string`
Convertie une chaîne en **base64** ou **base64Url** en une chaîne en **base16**.

**Arguments:**
<ul>
  <li>
    <strong>from?: "B64" | "B64URL"</strong> — (Default: <strong>"B64"</strong>)
    <br/>
    Spécifie dans quel encodage la chaîne doit être fournie.
  </li>
</ul>