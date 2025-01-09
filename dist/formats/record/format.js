"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordFormat = void 0;
const testers_1 = require("../../testers");
const AbstractFormat_1 = require("../AbstractFormat");
class RecordFormat extends AbstractFormat_1.AbstractFormat {
    constructor() {
        super({
            empty: false
        });
        this.type = "record";
    }
    mountCriteria(definedCriteria, mountedCriteria) {
        return (Object.assign(mountedCriteria, this.baseMountedCriteria, definedCriteria));
    }
    getMountingTasks(definedCriteria, mountedCriteria) {
        let buildTasks = [];
        buildTasks.push({
            definedCriteria: definedCriteria.key,
            mountedCriteria: mountedCriteria.key
        });
        if ((0, AbstractFormat_1.isAlreadyMounted)(definedCriteria.value)) {
            mountedCriteria.value = definedCriteria.value;
        }
        else {
            buildTasks.push({
                definedCriteria: definedCriteria.value,
                mountedCriteria: mountedCriteria.value
            });
        }
        return (buildTasks);
    }
    objectLength(obj) {
        return (Object.keys(obj).length + Object.getOwnPropertySymbols(obj).length);
    }
    checkEntry(criteria, entry) {
        if (entry === undefined) {
            return (!criteria.require ? null : "REJECT_TYPE_UNDEFINED");
        }
        else if (!(0, testers_1.isObject)(entry)) {
            return ("REJECT_TYPE_NOT_OBJECT");
        }
        else if (!(0, testers_1.isPlainObject)(entry)) {
            return ("REJECT_TYPE_NOT_PLAIN_OBJECT");
        }
        const numberKeys = Object.keys(entry).length;
        if (numberKeys === 0) {
            return ("REJECT_VALUE_EMPTY");
        }
        else if (criteria.min !== undefined && numberKeys < criteria.min) {
            return ("REJECT_VALUE_INFERIOR_MIN");
        }
        else if (criteria.max !== undefined && numberKeys > criteria.max) {
            return ("REJECT_VALUE_SUPERIOR_MAX");
        }
        return (null);
    }
    getCheckingTasks(criteria, entry) {
        let checkTasks = [];
        const keys = Object.keys(entry);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            checkTasks.push({
                criteria: criteria.key,
                entry: key
            });
            checkTasks.push({
                criteria: criteria.value,
                entry: entry[key]
            });
        }
        return (checkTasks);
    }
}
exports.RecordFormat = RecordFormat;
