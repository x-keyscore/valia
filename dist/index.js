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
const userSchema = new schema_1.Schema({
    type: "struct",
    struct: {
        name: { type: "string" }
    }
});
let user = { name: 11 };
console.log(userSchema.check(user));
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
    struct: {
        username: { type: "string" },
        avatar: { type: "string" },
        ip: {
            type: "string",
            tester: { name: "isAlpha" },
            custom(input) {
                return (false);
            },
        }
    }
});

const test = {
    username: "tintin",
    avatar: "picture",
    ip: "192.168.00.0"
} as unknown;
if (userSchema.checkGuard(test)) {
    console.log(test)
}

const start = performance.now();
console.log(userSchema.check(input))
const end = performance.now();
const timeTaken = end - start;
console.log(`Schema check - Execution Time: ${timeTaken.toFixed(2)} ms`);
*/
