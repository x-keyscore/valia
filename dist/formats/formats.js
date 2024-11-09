"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formats = void 0;
const array_1 = require("./array/array");
const number_1 = require("./number/number");
const record_1 = require("./record/record");
const string_1 = require("./string/string");
exports.formats = {
    record: record_1.RecordFormat,
    array: array_1.ArrayFormat,
    string: string_1.StringFormat,
    number: number_1.NumberFormat
};
