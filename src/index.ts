export * from './testers';
export * from './schema';
export * from './tools';

import { Schema } from "./schema";

const userNameType = new Schema({ type: "string" });

const userTestType = new Schema({
	type: "record",
	require: false,
	key: userNameType.criteria,
	value: userNameType.criteria
});

const userSchema = new Schema({ 
    type: "struct",
	require: false,
	struct: {
		test: userNameType.criteria,
		test2: userTestType.criteria
	}
});

let test = {
	test: "test",
	test2: "test2"
} as any;

if (userSchema.guard(test)) {
	let tt = test?.test2
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



