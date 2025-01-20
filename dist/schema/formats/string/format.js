"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringFormat = void 0;
const __1 = require("../../..");
exports.StringFormat = {
    checkCriteria: {
        min: __1.testers.primitive.isNumber,
        max: __1.testers.primitive.isNumber,
        empty: __1.testers.primitive.isBoolean,
        regex: __1.testers.object.isRegex,
        tester: __1.testers.object.isPlainObject,
        custom: __1.testers.object.isPlainFunction
    },
    defaultCriteria: {
        empty: true
    },
    checking(queue, criteria, value) {
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
        else if (criteria.regex !== undefined && !criteria.regex.test(value)) {
            return ("VALUE_REGEX_FAILED");
        }
        else if (criteria.tester && !__1.testers.string[criteria.tester.name](value, (_a = criteria.tester) === null || _a === void 0 ? void 0 : _a.params)) {
            return ("VALUE_TESTER_FAILED");
        }
        else if (criteria.custom && !criteria.custom(value)) {
            return ("VALUE_CUSTOM_FAILED");
        }
        return (null);
    },
};
