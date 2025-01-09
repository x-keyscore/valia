export * from './testers';
export * from './schema';
export * from './tools';

import { Schema } from "./schema";

const userSchema = new Schema({ 
    type: "struct",
    struct: {
        name: { type: "string" }
    }
});

let user = { name: 11 };

console.log(userSchema.check(user))
/*
const start = performance.now();
console.log(userSchema.check(input))
const end = performance.now();
const timeTaken = end - start;
console.log(`Schema check - Execution Time: ${timeTaken.toFixed(2)} ms`);
*/



