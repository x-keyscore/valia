"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayFormat = void 0;
const testers_1 = require("../../testers");
const AbstractFormat_1 = require("../AbstractFormat");
class ArrayFormat extends AbstractFormat_1.AbstractFormat {
    predefinedCriteria = {
        empty: true
    };
    constructor(criteria) {
        super(criteria);
    }
    checker(input) {
        const criteria = this.criteria;
        if (input === undefined) {
            const isCompliant = !criteria.require;
            return {
                error: isCompliant ? null : { code: "ARRAY_IS_UNDEFINED" }
            };
        }
        else if (!(0, testers_1.isObject)(input)) {
            return {
                error: { code: "ARRAY_NOT_OBJECT" }
            };
        }
        else if (!(0, testers_1.isArray)(input)) {
            return {
                error: { code: "ARRAY_NOT_ARRAY" }
            };
        }
        else if (!input.length) {
            const isCompliant = criteria.empty;
            return {
                error: isCompliant ? null : { code: "ARRAY_IS_EMPTY" }
            };
        }
        else if (criteria.min !== undefined && input.length < criteria.min) {
            return {
                error: { code: "ARRAY_TOO_SHORT" }
            };
        }
        else if (criteria.max !== undefined && input.length > criteria.max) {
            return { error: { code: "ARRAY_TOO_LONG" } };
        }
        return { error: null };
    }
}
exports.ArrayFormat = ArrayFormat;
