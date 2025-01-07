"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatsInstances = exports.formats = void 0;
const format_1 = require("./array/format");
const format_2 = require("./tuple/format");
const format_3 = require("./record/format");
const format_4 = require("./struct/format");
const format_5 = require("./number/format");
const format_6 = require("./string/format");
const format_7 = require("./symbol/format");
const format_8 = require("./boolean/format");
const utils_1 = require("../schema/utils");
exports.formats = {
    array: format_1.ArrayFormat,
    tuple: format_2.TupleFormat,
    record: format_3.RecordFormat,
    struct: format_4.StructFormat,
    number: format_5.NumberFormat,
    string: format_6.StringFormat,
    symbol: format_7.SymbolFormat,
    boolean: format_8.BooleanFormat
};
exports.formatsInstances = (0, utils_1.constructs)(exports.formats, []);
