"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanFormat = void 0;
const testers_1 = require("../../testers");
const AbstractFormat_1 = require("../AbstractFormat");
class BooleanFormat extends AbstractFormat_1.AbstractFormat {
    constructor() {
        super({});
        this.type = "boolean";
    }
    mountCriteria(definedCriteria, mountedCriteria) {
        return (Object.assign(mountedCriteria, this.baseMountedCriteria, definedCriteria));
    }
    getMountingTasks(definedCriteria, mountedCriteria) {
        return ([]);
    }
    checkEntry(criteria, entry) {
        if (entry === undefined) {
            return (!criteria.require ? null : "REJECT_TYPE_UNDEFINED");
        }
        else if (!(0, testers_1.isBoolean)(entry)) {
            return ("REJECT_TYPE_NOT_BOOLEAN");
        }
        return (null);
    }
    getCheckingTasks(criteria, entry) {
        return ([]);
    }
}
exports.BooleanFormat = BooleanFormat;
