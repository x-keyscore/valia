"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberFormat = void 0;
const testers_1 = require("../../testers");
const AbstractFormat_1 = require("../AbstractFormat");
class NumberFormat extends AbstractFormat_1.AbstractFormat {
    constructor() {
        super({
            empty: true,
            trim: true
        });
        this.type = "number";
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
        else if (!(0, testers_1.isNumber)(entry)) {
            return ("REJECT_TYPE_NOT_NUMBER");
        }
        else if (criteria.min !== undefined && entry < criteria.min) {
            return ("REJECT_VALUE_TOO_SMALL");
        }
        else if (criteria.max !== undefined && entry > criteria.max) {
            return ("REJECT_VALUE_TOO_BIG");
        }
        return (null);
    }
    getCheckingTasks(criteria, entry) {
        return ([]);
    }
}
exports.NumberFormat = NumberFormat;
