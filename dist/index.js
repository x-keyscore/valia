"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./testers"), exports);
__exportStar(require("./schema"), exports);
__exportStar(require("./tools"), exports);
const schema_1 = require("./schema");
const stringType = new schema_1.Schema({ type: "string" });
const unionType = new schema_1.Schema({
    type: 'union',
    union: [stringType.criteria, { type: "number", max: 20 }, { type: "boolean" }]
});
const recordType = new schema_1.Schema({
    type: "record",
    empty: "r",
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
console.log("start");
const start = performance.now();
console.log(recordType.check(object));
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
