"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanFormat = void 0;
const formats_1 = require("../formats");
const testers_1 = require("../../testers");
exports.BooleanFormat = {
    mountCriteria(definedCriteria, mountedCriteria) {
        return (Object.assign(mountedCriteria, formats_1.defaultGlobalCriteria, definedCriteria));
    },
    checkValue(criteria, value) {
        if (!(0, testers_1.isBoolean)(value)) {
            return ("TYPE_NOT_BOOLEAN");
        }
        return (null);
    }
};
