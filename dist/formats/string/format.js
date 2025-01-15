"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringFormat = void 0;
const formats_1 = require("../formats");
const __1 = require("../../");
exports.StringFormat = {
    defaultCriteria: {
        empty: true
    },
    mountCriteria(definedCriteria, mountedCriteria) {
        return (Object.assign(mountedCriteria, formats_1.defaultGlobalCriteria, this.defaultCriteria, definedCriteria));
    },
    checkValue(criteria, value) {
        var _a;
        if (!(0, __1.isString)(value)) {
            return ("TYPE_NOT_STRING");
        }
        else if (!value.length) {
            return (criteria.empty ? null : "VALUE_EMPTY");
        }
        else if (criteria.min !== undefined && value.length < criteria.min) {
            return ("VALUE_INFERIOR_MIN");
        }
        else if (criteria.max !== undefined && value.length > criteria.max) {
            return ("VALUE_SUPERIOR_MAX");
        }
        else if (criteria.regex !== undefined && !criteria.regex.test(value)) {
            return ("VALUE_REGEX_FAILED");
        }
        else if (criteria.tester && !__1.testers.string[criteria.tester.name](value, (_a = criteria.tester) === null || _a === void 0 ? void 0 : _a.params)) {
            return ("VALUE_TESTER_FAILED");
        }
        else if (criteria.custom && !criteria.custom(value)) {
            return ("VALUE_CUSTOM_FAILED");
        }
        return null;
    }
};
