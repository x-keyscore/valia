"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberFormat = void 0;
const testers_1 = require("../../testers");
const AbstractFormat_1 = require("../AbstractFormat");
class NumberFormat extends AbstractFormat_1.AbstractFormat {
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
                error: isCompliant ? null : { code: "NUMBER_IS_UNDEFINED" }
            };
        }
        else if (!(0, testers_1.isNumber)(input)) {
            return {
                error: { code: "NUMBER_NOT_NUMBER" }
            };
        }
        else if (criteria.min !== undefined && input < criteria.min) {
            return {
                error: { code: "NUMBER_TOO_SMALL" }
            };
        }
        else if (criteria.max !== undefined && input > criteria.max) {
            return {
                error: { code: "NUMBER_TOO_BIG" }
            };
        }
        else if (criteria.accept !== undefined) {
            let temp = input.toString();
            if (!criteria.accept.test(temp)) {
                return {
                    error: { code: "NUMBER_WRONG_FORMAT" }
                };
            }
        }
        return {
            error: null
        };
    }
}
exports.NumberFormat = NumberFormat;
