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
exports.testSchema = exports.stringToUTF16UnitArray = exports.Schema = void 0;
var schema_1 = require("./schema");
Object.defineProperty(exports, "Schema", { enumerable: true, get: function () { return schema_1.Schema; } });
var tools_1 = require("./tools");
Object.defineProperty(exports, "stringToUTF16UnitArray", { enumerable: true, get: function () { return tools_1.stringToUTF16UnitArray; } });
__exportStar(require("./testers"), exports);
/*
const start = performance.now();
const end = performance.now();
const timeTaken = end - start;
console.log(`Execution Time: ${timeTaken.toFixed(2)} ms`);
*/
const schema_2 = require("./schema");
const userCredentiaFormat = new schema_2.Schema({
    type: "struct",
    struct: {
        email: { type: "string", tester: { name: "isEmail" } },
        password: { type: "string" }
    }
});
const userProfileFormat = new schema_2.Schema({
    type: "struct",
    struct: {
        firstName: { type: "string" },
        lastName: { type: "string" },
        color: { type: "string", regex: /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/ },
        avatar: { type: "string" },
        contact: {
            type: "struct",
            struct: {
                email: { type: "string", tester: { name: "isEmail" } },
                phoneNumber: { type: "string" }
            }
        }
    }
});
const userSettingFormat = new schema_2.Schema({
    type: "struct",
    struct: {
        notification: { type: "boolean" },
        theme: { type: "string" }
    }
});
const userSessionFormat = new schema_2.Schema({
    type: "struct",
    struct: {
        ip: {
            type: "struct",
            struct: {
                internal: { type: "string", tester: { name: "isIp", params: { allowIpV6: false } } },
                external: { type: "string", tester: { name: "isIp", params: { allowIpV6: false } } }
            }
        },
        agent: { type: "string" },
        token: { type: "string" }
    }
});
exports.testSchema = new schema_2.Schema({
    type: "record",
    key: { type: "string" },
    value: { type: "union", union: [{ type: "string" }, { type: "number" }] }
});
let data = {};
for (let i = 0; i < 100000; i++) {
    if (i % 2 === 0)
        data[`${i}`] = i;
    else
        data[`${i}`] = `${i}`;
}
exports.testSchema.check(data);
const start = performance.now();
console.log(data);
const end = performance.now();
const timeTaken = end - start;
console.log(`Execution Time: ${timeTaken.toFixed(2)} ms`);
