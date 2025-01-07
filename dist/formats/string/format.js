"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringFormat = void 0;
const AbstractFormat_1 = require("../AbstractFormat");
const testers_1 = require("../../testers");
class StringFormat extends AbstractFormat_1.AbstractFormat {
    constructor() {
        super({
            empty: true,
            trim: false
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
                error: !criteria.require ? null : { code: "STRING_IS_UNDEFINED" }
            };
        }
        else if (!(0, testers_1.isString)(value)) {
            return {
                error: { code: "STRING_NOT_STRING" }
            };
        }
        let str = value;
        if (criteria.trim)
            str = str.trim();
        if (!str.length) {
            return {
                error: criteria.empty ? null : { code: "STRING_IS_EMPTY" }
            };
        }
        else if (criteria.min !== undefined && str.length < criteria.min) {
            return {
                error: { code: "STRING_TOO_SHORT" }
            };
        }
        else if (criteria.max !== undefined && str.length > criteria.max) {
            return {
                error: { code: "STRING_TOO_LONG" }
            };
        }
        else if (criteria.accept !== undefined && !criteria.accept.test(str)) {
            return {
                error: { code: "STRING_NOT_RESPECT_REGEX" }
            };
        }
        else if (criteria.kind && !testers_1.strings[criteria.kind.name](str, criteria.kind.params)) {
            return {
                error: { code: "STRING_NOT_RESPECT_KIND" }
            };
        }
        return {
            error: null
        };
    }
    getCheckingTasks(mountedCriteria, value) {
        return ([]);
    }
}
exports.StringFormat = StringFormat;
