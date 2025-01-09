"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TupleFormat = void 0;
const testers_1 = require("../../testers");
const AbstractFormat_1 = require("../AbstractFormat");
class TupleFormat extends AbstractFormat_1.AbstractFormat {
    constructor() {
        super({
            empty: false
        });
        this.type = "tuple";
    }
    mountCriteria(definedCriteria, mountedCriteria) {
        return (Object.assign(mountedCriteria, this.baseMountedCriteria, definedCriteria));
    }
    getMountingTasks(definedCriteria, mountedCriteria) {
        let buildTasks = [];
        for (let i = 0; i < definedCriteria.tuple.length; i++) {
            buildTasks.push({
                definedCriteria: definedCriteria.tuple[i],
                mountedCriteria: mountedCriteria.tuple[i]
            });
        }
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
        const entryLength = entry.length;
        if (!entryLength) {
            return (criteria.empty ? null : "REJECT_VALUE_EMPTY");
        }
        else if (criteria.min !== undefined && entryLength < criteria.min) {
            return ("REJECT_VALUE_INFERIOR_MIN");
        }
        else if (criteria.max !== undefined && entryLength > criteria.max) {
            return ("REJECT_VALUE_SUPERIOR_MAX");
        }
        else if (criteria.min === undefined && criteria.max === undefined) {
            if (entryLength < criteria.tuple.length) {
                return ("REJECT_VALUE_INFERIOR_TUPLE");
            }
        }
        else if (entryLength > criteria.tuple.length) {
            return ("REJECT_VALUE_SUPERIOR_TUPLE");
        }
        return (null);
    }
    getCheckingTasks(criteria, entry) {
        let checkTasks = [];
        for (let i = 0; i < entry.length; i++) {
            checkTasks.push({
                criteria: criteria.tuple[i],
                entry: entry[i]
            });
        }
        return (checkTasks);
    }
}
exports.TupleFormat = TupleFormat;
