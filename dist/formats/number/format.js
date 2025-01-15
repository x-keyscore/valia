"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberFormat = void 0;
const formats_1 = require("../formats");
const testers_1 = require("../../testers");
exports.NumberFormat = {
    defaultCriteria: {},
    mountCriteria(definedCriteria, mountedCriteria) {
        return (Object.assign(mountedCriteria, formats_1.defaultGlobalCriteria, definedCriteria));
    },
    checkValue(criteria, value) {
        if (!(0, testers_1.isNumber)(value)) {
            return ("TYPE_NOT_NUMBER");
        }
        else if (criteria.min !== undefined && value < criteria.min) {
            return ("VALUE_SUPERIOR_MIN");
        }
        else if (criteria.max !== undefined && value > criteria.max) {
            return ("VALUE_SUPERIOR_MAX");
        }
        else if (criteria.custom && !criteria.custom(value)) {
            return ("TEST_CUSTOM_FAILED");
        }
        return (null);
    }
};
