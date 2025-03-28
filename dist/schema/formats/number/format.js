"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberFormat = void 0;
const testers_1 = require("../../../testers");
exports.NumberFormat = {
    defaultCriteria: {},
    checking(queue, path, criteria, value) {
        if (typeof value !== "number") {
            return ("TYPE_NOT_NUMBER");
        }
        else if (criteria.min !== undefined && value < criteria.min) {
            return ("VALUE_SUPERIOR_MIN");
        }
        else if (criteria.max !== undefined && value > criteria.max) {
            return ("VALUE_SUPERIOR_MAX");
        }
        else if (criteria.enum !== undefined) {
            if ((0, testers_1.isPlainObject)(criteria.enum) && !Object.values(criteria.enum).includes(value)) {
                return ("VALUE_NOT_IN_ENUM");
            }
            else if ((0, testers_1.isArray)(criteria.enum) && !criteria.enum.includes(value)) {
                return ("VALUE_NOT_IN_ENUM");
            }
        }
        else if (criteria.custom && !criteria.custom(value)) {
            return ("TEST_CUSTOM_FAILED");
        }
        return (null);
    }
};
