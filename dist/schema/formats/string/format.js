"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringFormat = void 0;
const testers_1 = require("../../../testers");
exports.StringFormat = {
    defaultCriteria: {
        empty: true
    },
    checking(queue, path, criteria, value) {
        var _a;
        if (typeof value !== "string") {
            return ("TYPE_NOT_STRING");
        }
        const valueLength = value.length;
        if (!valueLength) {
            return (criteria.empty ? null : "VALUE_EMPTY");
        }
        else if (criteria.min !== undefined && valueLength < criteria.min) {
            return ("VALUE_INFERIOR_MIN");
        }
        else if (criteria.max !== undefined && valueLength > criteria.max) {
            return ("VALUE_SUPERIOR_MAX");
        }
        else if (criteria.enum !== undefined) {
            if ((0, testers_1.isArray)(criteria.enum) && !criteria.enum.includes(value)) {
                return ("VALUE_NOT_IN_ENUM");
            }
            else if ((0, testers_1.isPlainObject)(criteria.enum) && !Object.values(criteria.enum).includes(value)) {
                return ("VALUE_NOT_IN_ENUM");
            }
        }
        else if (criteria.regex !== undefined && !criteria.regex.test(value)) {
            return ("TEST_REGEX_FAILED");
        }
        else if (criteria.tester && !testers_1.testers.string[criteria.tester.name](value, (_a = criteria.tester) === null || _a === void 0 ? void 0 : _a.params)) {
            return ("TEST_TESTER_FAILED");
        }
        else if (criteria.custom && !criteria.custom(value)) {
            return ("TEST_CUSTOM_FAILED");
        }
        return (null);
    }
};
