"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("./schema");
/*
const schemaArray: Array<unknown> = [];
for (let i = 0; i <= 2500; i++) {
    schemaArray[i] = { type: "string" };
}

const schemaEntry: Record<string, unknown> = {};
for (let i = 0; i <= 2500; i++) {
    schemaEntry[i.toString()] = {
        require: false,
        type: "tuple",
        tuple: schemaArray
    };
}

const userSchema = new Schema({
    type: "struct",
    label: "merde c'est ici",
    struct: {
        test_0: {
            label: "c'est ici le probleme mec",
            type: "struct",
            struct: schemaEntry as any
        },
        test_1: {
            label: "ou la",
            type: "struct",
            struct: {
                test_1_0: { type: "string" },
                test_1_1: { type: "string" }
            }
        },
        test_2: {
            type: "tuple",
            label: "ou ici",
            require: false,
            tuple: [{ type: "string"}]
        },
        test_3: {
            type: "record",
            key: {
                type: "string"
            },
            value: {
                type: "string"
            }
        }
    }
})

const inputArray: Array<unknown> = [];
for (let i = 0; i <= 2500; i++) {
    inputArray[i] = i.toString();
}

const inputEntry: Record<string, unknown> = {};
for (let i = 0; i <= 2500; i++) {
    inputEntry[i.toString()] = inputArray;
}

const input: unknown = {
    test_0: inputEntry,
    test_1: {
        test_1_0: "test1_1",
        test_1_1: "test1_2",
    }
}

const start = performance.now();
console.log(userSchema.check(input))
const end = performance.now();
const timeTaken = end - start;
console.log(`Schema check - Execution Time: ${timeTaken.toFixed(2)} ms`);
*/
const stringSchema = new schema_1.Schema({
    type: "string",
    kind: { name: "isAlpha", params: undefined }
});
const recordSchema = new schema_1.Schema({
    type: "record",
    label: "root",
    key: {
        type: "string"
    },
    value: stringSchema
});
let test = {
    test: "test"
};
if (recordSchema.checkGuard(test)) {
}
/*
const recordSchema = new Schema({
    type: "record",
    label: "root",
    key: {
        type: "string"
    },
    value: stringSchema
})

const inputArray: Array<unknown> = [];
for (let i = 0; i <= 5000; i++) {
    inputArray[i] = i.toString();
}

const inputEntry: Record<string, unknown> = {};
for (let i = 0; i <= 5000; i++) {
    inputEntry[i.toString()] = inputArray;
}

const input = inputEntry

const start = performance.now();
if (recordSchema.checkGuard(input)) {
    let tt = input.test
}
const end = performance.now();
const timeTaken = end - start;
console.log(`Schema check - Execution Time: ${timeTaken.toFixed(2)} ms`);
while(true) {}*/
