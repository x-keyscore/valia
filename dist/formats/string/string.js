"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringFormat = void 0;
const testers_1 = require("../../testers");
const AbstractFormat_1 = require("../AbstractFormat");
class StringFormat extends AbstractFormat_1.AbstractFormat {
    predefinedCriteria = {
        empty: true,
        trim: true
    };
    constructor(criteria) {
        super(criteria);
    }
    checker(input) {
        const criteria = this.criteria;
        if (input === undefined) {
            const isCompliant = !criteria.require;
            return {
                error: isCompliant ? null : { code: "STRING_IS_UNDEFINED" }
            };
        }
        else if (!(0, testers_1.isString)(input)) {
            return {
                error: { code: "STRING_NOT_STRING" }
            };
        }
        let temp = input;
        if (criteria.trim)
            temp = temp.trim();
        if (!temp.length) {
            const isCompliant = criteria.empty;
            return {
                error: isCompliant ? null : { code: "STRING_IS_EMPTY" }
            };
        }
        else if (criteria.min !== undefined && temp.length < criteria.min) {
            return {
                error: { code: "STRING_TOO_SHORT" }
            };
        }
        else if (criteria.max !== undefined && temp.length > criteria.max) {
            return {
                error: { code: "STRING_TOO_LONG" }
            };
        }
        else if (criteria.accept !== undefined && !criteria.accept.test(temp)) {
            return {
                error: { code: "STRING_WRONG_FORMAT" }
            };
        }
        return {
            error: null
        };
    }
}
exports.StringFormat = StringFormat;
