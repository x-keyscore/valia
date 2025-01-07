"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = isObject;
exports.isPlainObject = isPlainObject;
exports.isArray = isArray;
exports.isPlainFunction = isPlainFunction;
exports.isAsyncFunction = isAsyncFunction;
exports.isGeneratorFunction = isGeneratorFunction;
exports.isAsyncGeneratorFunction = isAsyncGeneratorFunction;
exports.isGenerator = isGenerator;
exports.isAsyncGenerator = isAsyncGenerator;
exports.isSymbol = isSymbol;
const utils_1 = require("./utils");
// Object
function isObject(x) {
    return typeof x === "object";
}
function isPlainObject(x) {
    return (0, utils_1.hasTag)(x, "Object");
}
// Array
function isArray(x) {
    return Array.isArray(x);
}
// Function
function isPlainFunction(x) {
    return (0, utils_1.hasTag)(x, "Function");
}
function isAsyncFunction(x) {
    return (0, utils_1.hasTag)(x, "AsyncFunction");
}
function isGeneratorFunction(x) {
    return (0, utils_1.hasTag)(x, "GeneratorFunction");
}
function isAsyncGeneratorFunction(x) {
    return (0, utils_1.hasTag)(x, "AsyncGeneratorFunction");
}
function isGenerator(x) {
    return (0, utils_1.hasTag)(x, "Generator");
}
function isAsyncGenerator(x) {
    return (0, utils_1.hasTag)(x, "AsyncGenerator");
}
// Symbol
function isSymbol(x) {
    return typeof x === "symbol";
}
