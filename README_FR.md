# Valia · [![npm version](https://img.shields.io/npm/v/valia.svg?style=flat)](https://www.npmjs.com/package/valia)

Bibliothèque de validation légère et moderne pour TypeScript et JavaScript.

🔌 S’intègre naturellement à vos projets, qu’ils soient front-end ou back-end, et permet de définir des schémas de manière intuitive tout en favorisant leur réutilisation.

💡 Pensée pour allier simplicité et puissance, elle propose des fonctionnalités avancées comme l’inférence de types, ainsi que des validateurs standards tels que **isEmail**, **isUuid** ou **isIp**.

## Table of contents
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
*Ici **SchemaInfer** est à titre d'exemple et n'est pas utile au bon fonctionnement du schéma.*

<br/>

# Schema

## Instance

<ul>
  <li>
    <strong>criteria</strong>
    <br/>
    Propriété représentant la racine des noeuds de critères montés.
  </li>
  <li>
    <strong>validate(data)</strong>
    <br/>
    Valide les données fournies par rapport au schéma et renvoie un boolean.
    <br/>
    Cette fonction utilise la
    <a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates">prédiction de type</a>,
    si elle renvoie <strong>true</strong> le type de la valeur passée en paramètre sera du type déduit de votre schéma.
  </li>
  <li>
    <strong>evaluate(data)</strong>
    <br/>
    Valide les données fournies par rapport au schéma et renvoie un objet avec les propriétés suivantes :
    <ul>
      <li>
        <strong>rejection</strong>: Instance de <strong>SchemaDataRejection</strong> si la valeur est rejetée sinon <strong>null</strong>.
      </li>
      <li>
        <strong>data</strong>:Données passées en paramètre de la fonction si celles-ci sont acceptées sinon <strong>null</strong>.
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
    Noeud de critères ayant émis le rejet.
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

### SchemaNodeException

<ul>
  <li>
    <strong>code</strong>
    <br/>
    Code de rejet du noeud (e.g. <strong>"MIN_PROPERTY_MALFORMED"</strong>, <strong>"REGEX_PROPERTY_MALFORMED"</strong>).
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
    Noeud de critères ayant émis le rejet.
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

[Number](#number) • [String](#string) • [Symbol](#symbol) • [Boolean](#boolean) • [Object](#object) • [Array](#array) • [Function](#function) • [Simple](#simple) • [Union](#union)

*L'ordre des propriétés décrites respecte l'ordre d'exécution par le validateur*

### Global

#### **Propriétés :**

<ul>
  <li>
    <strong>label?</strong>
    <br/>
    Une chaine de caratéres permetant d'idantifié le noeud, celle-ci vous sera retournée dans les instance de <strong>SchemaRejection</strong> et <strong>SchemaException</strong>.
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
    <strong>custom()?</strong>
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
  type: "string",
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
  type: "string",
  literal: 141
});

✅ schema.validate(141);

❌ schema.validate(-1);
❌ schema.validate(-10);
```

**Validé des nombres spécifique avec un tableau**
```ts
const schema = new Schema({
  type: "string",
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
    Une expression régulière pouvant être fournie sous forme d'objet (<strong>RegExp</strong>) ou sous forme de chaîne de caractères (<strong>string</strong>).
  </li>
  <li>
    <strong>literal?</strong>
    <br/>
    <ul>
      <li><strong>string</strong>: Restreint la valeur à une seul chaîne de caractères.</li>
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
    <strong>custom()?</strong>
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
    <strong>custom()?</strong>
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


### Boolean

#### **Propriétés :**

<ul>
  <li>
    <strong>literal?</strong>
    <br/>
    Restreint la valeur à un seul état de booléen valide.
  </li>
  <br/>
  <li>
    <strong>custom()?</strong>
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
|`cidr?: boolean`|Allow prefixes at the end of IP addresses (e.g., `192.168.0.1/22`).|

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
