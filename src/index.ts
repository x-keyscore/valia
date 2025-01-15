export * from './testers';
export * from './schema';
export * from './tools';

import { Schema } from "./schema";

const stringType = new Schema({ type: "string" });

const unionType = new Schema({
	type: 'union',
	union: [stringType.criteria, { type: "number", max: 20 }, { type: "boolean" }]
});

const recordType = new Schema({ 
	type: "record",
	key: { type: "string" },
	value: unionType.criteria
});

let object = {};
for (let i = 0; i < 50000; i++) {
	Object.assign(object, { [`${i}`]: "r" });
}

/*
let test = {};
test as any
if (structType.guard(test)) {
	test
}*/
console.log("start")
const start = performance.now();
console.log(recordType.check(object))
const end = performance.now();
const timeTaken = end - start;
console.log(`Schema check - Execution Time: ${timeTaken.toFixed(2)} ms`);
/*
const arrayType = new Schema({ 
	type: "array",
	item: unionType.criteria
});
const tupleType = new Schema({ 
	type: "tuple",
	tuple: [structType.criteria, { type: "number" }]
});

const structType = new Schema({ 
	type: "struct",
	struct: {
		k: arrayType.criteria,
		k2: unionType.criteria
	}
});*/
/*
if (structType.guard(test)) {
	test
}*/

/*
const start = performance.now();
console.log(userSchema.check(input))
const end = performance.now();
const timeTaken = end - start;
console.log(`Schema check - Execution Time: ${timeTaken.toFixed(2)} ms`);
*/



