export * from './testers';
export * from './schema';
export * from './tools';

import { Schema } from "./schema";

const userNameType = new Schema({ require: false, type: "string" });

const userTestType = new Schema({
	type: "struct",
	optionalKeys: "Y",
	struct: {
		name: { require: false, type: "string" }
	}
});

const userSchema = new Schema({
    type: "tuple",
	tuple: [userTestType.criteria, userNameType.criteria]
});

let test = {
	test: "test",
	test2: "test2"
} as any;

if (userSchema.guard(test)) {
	let tt = test[0]
}

let user = { name: 11 };

console.log(userSchema.check(user))
/*
const start = performance.now();
console.log(userSchema.check(input))
const end = performance.now();
const timeTaken = end - start;
console.log(`Schema check - Execution Time: ${timeTaken.toFixed(2)} ms`);
*/



