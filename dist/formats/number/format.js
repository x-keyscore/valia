"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberFormat = void 0;
const testers_1 = require("../../testers");
const AbstractFormat_1 = require("../AbstractFormat");
class NumberFormat extends AbstractFormat_1.AbstractFormat {
    constructor() {
        super({
            empty: true,
            trim: true
        });
    }
    mountCriteria(definedCriteria, mountedCriteria) {
        return (Object.assign(mountedCriteria, this.baseCriteria, definedCriteria));
    }
    getMountingTasks(definedCriteria, mountedCriteria) {
        return ([]);
    }
    checkValue(mountedCriteria, value) {
        const criteria = mountedCriteria;
        if (value === undefined) {
            return {
                error: !criteria.require ? null : { code: "NUMBER_IS_UNDEFINED" }
            };
        }
        else if (!(0, testers_1.isNumber)(value)) {
            return {
                error: { code: "NUMBER_NOT_NUMBER" }
            };
        }
        else if (criteria.min !== undefined && value < criteria.min) {
            return {
                error: { code: "NUMBER_TOO_SMALL" }
            };
        }
        else if (criteria.max !== undefined && value > criteria.max) {
            return {
                error: { code: "NUMBER_TOO_BIG" }
            };
        }
        else if (criteria.accept !== undefined) {
            let string = value.toString();
            if (!criteria.accept.test(string)) {
                return {
                    error: { code: "NUMBER_NOT_RESPECT_REGEX" }
                };
            }
        }
        return {
            error: null
        };
    }
    getCheckingTasks(mountedCriteria, value) {
        return ([]);
    }
}
exports.NumberFormat = NumberFormat;
