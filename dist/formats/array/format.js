"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayFormat = void 0;
const testers_1 = require("../../testers");
const AbstractFormat_1 = require("../AbstractFormat");
class ArrayFormat extends AbstractFormat_1.AbstractFormat {
    constructor() {
        super({
            empty: true
        });
        this.type = "array";
    }
    mountCriteria(definedCriteria, mountedCriteria) {
        return (Object.assign(mountedCriteria, this.baseMountedCriteria, definedCriteria));
    }
    getMountingTasks(definedCriteria, mountedCriteria) {
        let buildTasks = [{
                definedCriteria: definedCriteria.item,
                mountedCriteria: mountedCriteria.item
            }];
        return (buildTasks);
    }
    checkEntry(criteria, entry) {
        if (entry === undefined) {
            return (!criteria.require ? null : "REJECT_TYPE_UNDEFINED");
        }
        else if (!(0, testers_1.isObject)(entry)) {
            return ("REJECT_TYPE_NOT_OBJECT");
        }
        else if (!(0, testers_1.isArray)(entry)) {
            return ("REJECT_TYPE_NOT_ARRAY");
        }
        else if (!entry.length) {
            return ("REJECT_VALUE_EMPTY");
        }
        else if (criteria.min !== undefined && entry.length < criteria.min) {
            return ("REJECT_VALUE_INFERIOR_MIN");
        }
        else if (criteria.max !== undefined && entry.length > criteria.max) {
            return ("REJECT_VALUE_SUPERIOR_MAX");
        }
        return (null);
    }
    getCheckingTasks(criteria, entry) {
        let checkTasks = [];
        for (let i = 0; i < entry.length; i++) {
            checkTasks.push({
                criteria: criteria.item,
                entry: entry[i]
            });
        }
        return (checkTasks);
    }
}
exports.ArrayFormat = ArrayFormat;
