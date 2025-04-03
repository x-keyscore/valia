"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatNatives = exports.staticDefaultCriteria = void 0;
const format_1 = require("./boolean/format");
const format_2 = require("./symbol/format");
const format_3 = require("./string/format");
const format_4 = require("./number/format");
const format_5 = require("./struct/format");
const format_6 = require("./record/format");
const format_7 = require("./tuple/format");
const format_8 = require("./array/format");
const format_9 = require("./omega/format");
const format_10 = require("./union/format");
exports.staticDefaultCriteria = {
    nullable: false,
    undefinable: false
};
exports.formatNatives = {
    boolean: format_1.BooleanFormat,
    symbol: format_2.SymbolFormat,
    string: format_3.StringFormat,
    number: format_4.NumberFormat,
    struct: format_5.StructFormat,
    record: format_6.RecordFormat,
    tuple: format_7.TupleFormat,
    array: format_8.ArrayFormat,
    omega: format_9.OmegaFormat,
    union: format_10.UnionFormat
};
