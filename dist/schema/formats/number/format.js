"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberFormat = void 0;
const testers_1 = require("../../../testers");
exports.NumberFormat = {
    defaultCriteria: {},
    check(chunk, criteria, data) {
        if (typeof data !== "number") {
            return ("TYPE_NOT_NUMBER");
        }
        else if (criteria.min !== undefined && data < criteria.min) {
            return ("DATA_SUPERIOR_MIN");
        }
        else if (criteria.max !== undefined && data > criteria.max) {
            return ("DATA_SUPERIOR_MAX");
        }
        else if (criteria.enum !== undefined) {
            if ((0, testers_1.isPlainObject)(criteria.enum) && !Object.values(criteria.enum).includes(data)) {
                return ("DATA_NOT_IN_ENUM");
            }
            else if ((0, testers_1.isArray)(criteria.enum) && !criteria.enum.includes(data)) {
                return ("DATA_NOT_IN_ENUM");
            }
        }
        else if (criteria.custom && !criteria.custom(data)) {
            return ("TEST_CUSTOM_FAILED");
        }
        return (null);
    }
};
