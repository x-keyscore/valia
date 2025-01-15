"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formats = exports.defaultGlobalCriteria = exports.isMountedSymbol = void 0;
exports.isAlreadyMounted = isAlreadyMounted;
const format_1 = require("./array/format");
const format_2 = require("./tuple/format");
const format_3 = require("./record/format");
const format_4 = require("./struct/format");
const format_5 = require("./number/format");
const format_6 = require("./string/format");
const format_7 = require("./symbol/format");
const format_8 = require("./boolean/format");
const format_9 = require("./union/format");
exports.isMountedSymbol = Symbol('isMounted');
function isAlreadyMounted(criteria) {
    return (Object.prototype.hasOwnProperty(exports.isMountedSymbol));
}
exports.defaultGlobalCriteria = {
    [exports.isMountedSymbol]: true,
    optional: false,
    nullable: false
};
exports.formats = {
    array: format_1.ArrayFormat,
    tuple: format_2.TupleFormat,
    record: format_3.RecordFormat,
    struct: format_4.StructFormat,
    number: format_5.NumberFormat,
    string: format_6.StringFormat,
    symbol: format_7.SymbolFormat,
    boolean: format_8.BooleanFormat,
    union: format_9.UnionFormat
};
//export const formatsInstances = constructs(formats, []);
