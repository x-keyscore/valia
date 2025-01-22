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
exports.stringToUTF16UnitArray = exports.Schema = void 0;
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
const test = {
    // @ts-ignore
    [{ type: "string", max: 10 }]: {}
};
console.log(Object.entries(test));
