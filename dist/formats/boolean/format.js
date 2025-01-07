"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanFormat = void 0;
const testers_1 = require("../../testers");
const AbstractFormat_1 = require("../AbstractFormat");
class BooleanFormat extends AbstractFormat_1.AbstractFormat {
    constructor() {
        super({});
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
                error: !criteria.require ? null : { code: "BOOLEAN_IS_UNDEFINED" }
            };
        }
        else if (!(0, testers_1.isBoolean)(value)) {
            return {
                error: { code: "BOOLEAN_NOT_BOOLEAN" }
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
exports.BooleanFormat = BooleanFormat;
