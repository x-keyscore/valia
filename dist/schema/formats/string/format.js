"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringFormat = void 0;
const testers_1 = require("../../../testers");
exports.StringFormat = {
    defaultCriteria: {
        empty: true
    },
    check(chunk, criteria, data) {
        var _a;
        if (typeof data !== "string") {
            return ("TYPE_NOT_STRING");
        }
        const dataLength = data.length;
        if (!dataLength) {
            return (criteria.empty ? null : "DATA_EMPTY");
        }
        else if (criteria.min !== undefined && dataLength < criteria.min) {
            return ("DATA_INFERIOR_MIN");
        }
        else if (criteria.max !== undefined && dataLength > criteria.max) {
            return ("DATA_SUPERIOR_MAX");
        }
        else if (criteria.enum !== undefined) {
            if ((0, testers_1.isArray)(criteria.enum) && !criteria.enum.includes(data)) {
                return ("DATA_NOT_IN_ENUM");
            }
            else if ((0, testers_1.isPlainObject)(criteria.enum) && !Object.values(criteria.enum).includes(data)) {
                return ("DATA_NOT_IN_ENUM");
            }
        }
        else if (criteria.regex !== undefined && !criteria.regex.test(data)) {
            return ("TEST_REGEX_FAILED");
        }
        else if (criteria.tester && !testers_1.testers.string[criteria.tester.name](data, (_a = criteria.tester) === null || _a === void 0 ? void 0 : _a.params)) {
            return ("TEST_TESTER_FAILED");
        }
        else if (criteria.custom && !criteria.custom(data)) {
            return ("TEST_CUSTOM_FAILED");
        }
        return (null);
    }
};
