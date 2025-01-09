"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringFormat = void 0;
const AbstractFormat_1 = require("../AbstractFormat");
const testers_1 = require("../../testers");
const __1 = require("../../");
class StringFormat extends AbstractFormat_1.AbstractFormat {
    constructor() {
        super({
            empty: true,
            trim: false
        });
        this.type = "string";
    }
    mountCriteria(definedCriteria, mountedCriteria) {
        return (Object.assign(mountedCriteria, this.baseMountedCriteria, definedCriteria));
    }
    getMountingTasks(definedCriteria, mountedCriteria) {
        return ([]);
    }
    checkEntry(mountedCriteria, entry) {
        var _a;
        const criteria = mountedCriteria;
        if (entry === undefined) {
            return (!criteria.require ? null : "REJECT_TYPE_UNDEFINED");
        }
        else if (!(0, testers_1.isString)(entry)) {
            return ("REJECT_TYPE_NOT_STRING");
        }
        let str = entry;
        if (criteria.trim)
            str = str.trim();
        if (!str.length) {
            return (criteria.empty ? null : "REJECT_VALUE_EMPTY");
        }
        else if (criteria.min !== undefined && str.length < criteria.min) {
            return ("REJECT_VALUE_TOO_SHORT");
        }
        else if (criteria.max !== undefined && str.length > criteria.max) {
            return ("REJECT_VALUE_TOO_LONG");
        }
        else if (criteria.regex !== undefined && !criteria.regex.test(str)) {
            return ("REJECT_TEST_REGEX");
        }
        else if (criteria.test && !__1.testers.string[criteria.test.name](str, (_a = criteria.test) === null || _a === void 0 ? void 0 : _a.params)) {
            return ("REJECT_TEST_STRING");
        }
        else if (criteria.custom && !criteria.custom(str)) {
            return ("REJECT_TEST_CUSTOM");
        }
        return null;
    }
    getCheckingTasks(criteria, entry) {
        return ([]);
    }
}
exports.StringFormat = StringFormat;
