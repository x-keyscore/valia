"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("./schema");
const schemaEntry = {};
for (let i = 1; i <= 110000; i++) {
    schemaEntry[i.toString()] = {
        empty: true,
        type: "array",
        array: [{ type: "string" }]
    };
}
const schemaArray = [];
for (let i = 1; i <= 100000; i++) {
    schemaArray[i] = { type: "string" };
}
console.log("start");
const userSchema = new schema_1.Schema({
    type: "record",
    label: "merde c'est ici",
    record: {
        test_0: {
            label: "c'est ici le probleme mec",
            type: "record",
            record: schemaEntry
        },
        test_1: {
            label: "ou la",
            type: "record",
            record: {
                test_1_0: { type: "string" },
                test_1_1: { type: "string" }
            }
        },
        test_2: {
            label: "ou ici",
            type: "array",
            array: [{ type: "string" }]
        }
    }
});
const input = {
    test2: {
        test2_1: "test1_1",
        test2_2: "test1_2",
    }
};
console.log(userSchema.check(input));
/*
const stringArray = [];
for (let i = 1; i <= 100000; i++) {
    stringArray.push(`string${i}`);
}
//stringArray[10000] = 1;
const input: unknown = {
    test1: [...stringArray],
    test2: {
        test2_1: "test1_1",
        test2_2: "test1_2",
    }
}
const start = performance.now();

if (user.check(input)) {
    console.log(input.test1[0])
}

const end = performance.now();
const timeTaken = end - start;
console.log(`Execution Time: ${timeTaken.toFixed(2)} ms`);*/
while (true) { }
