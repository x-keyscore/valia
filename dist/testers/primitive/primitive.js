"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isString = isString;
exports.isBoolean = isBoolean;
exports.isNumber = isNumber;
exports.isBigint = isBigint;
exports.isSymbol = isSymbol;
exports.isUndefined = isUndefined;
exports.isNull = isNull;
function isString(x) {
    return typeof x === "string";
}
function isBoolean(x) {
    return typeof x === "boolean";
}
function isNumber(x) {
    return typeof x === "number";
}
function isBigint(x) {
    return typeof x === "bigint";
}
function isSymbol(x) {
    return typeof x === "symbol";
}
function isUndefined(x) {
    return x === undefined;
}
function isNull(x) {
    return x === null;
}
