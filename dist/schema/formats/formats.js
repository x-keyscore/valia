"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatNatives = exports.staticDefaultCriteria = void 0;
const format_1 = require("./array/format");
const format_2 = require("./omega/format");
const format_3 = require("./boolean/format");
const format_4 = require("./number/format");
const format_5 = require("./record/format");
const format_6 = require("./string/format");
const format_7 = require("./struct/format");
const format_8 = require("./symbol/format");
const format_9 = require("./tuple/format");
const format_10 = require("./union/format");
exports.staticDefaultCriteria = {
    nullable: false,
    undefinable: false
};
exports.formatNatives = {
    union: format_10.UnionFormat,
    omega: format_2.OmegaFormat,
    array: format_1.ArrayFormat,
    tuple: format_9.TupleFormat,
    record: format_5.RecordFormat,
    struct: format_7.StructFormat,
    number: format_4.NumberFormat,
    string: format_6.StringFormat,
    symbol: format_8.SymbolFormat,
    boolean: format_3.BooleanFormat
};
