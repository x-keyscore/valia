"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructFormat = void 0;
const testers_1 = require("../../testers");
const AbstractFormat_1 = require("../AbstractFormat");
class StructFormat extends AbstractFormat_1.AbstractFormat {
    constructor() {
        super({
            empty: false
        });
        this.type = "struct";
    }
    hasRequiredKeys(mountedCriteria, value) {
        const requiredKeys = mountedCriteria.requiredKeys;
        const inputKeys = Object.keys(value);
        for (const key of requiredKeys) {
            if (!inputKeys.includes(key))
                return (false);
        }
        return (true);
    }
    hasDefinedKeys(mountedCriteria, value) {
        const definedKeys = mountedCriteria.definedKeys;
        const inputKeys = Object.keys(value);
        for (const key of inputKeys) {
            if (!definedKeys.includes(key))
                return (false);
        }
        return (true);
    }
    mountCriteria(definedCriteria, mountedCriteria) {
        const requiredKeys = Object.entries(definedCriteria.struct)
            .filter(([key, criteria]) => criteria.require !== false)
            .map(([key]) => key);
        const definedKeys = Object.keys(definedCriteria.struct);
        return (Object.assign(mountedCriteria, this.baseMountedCriteria, definedCriteria, { requiredKeys, definedKeys }));
    }
    getMountingTasks(definedCriteria, mountedCriteria) {
        let buildTasks = [];
        const keys = Object.keys(definedCriteria.struct);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            buildTasks.push({
                definedCriteria: definedCriteria.struct[key],
                mountedCriteria: mountedCriteria.struct[key]
            });
        }
        return (buildTasks);
    }
    checkEntry(mountedCriteria, entry) {
        const criteria = mountedCriteria;
        if (entry === undefined) {
            return (!criteria.require ? null : "REJECT_TYPE_UNDEFINED");
        }
        else if (!(0, testers_1.isObject)(entry)) {
            return ("REJECT_TYPE_NOT_OBJECT");
        }
        else if (!(0, testers_1.isPlainObject)(entry)) {
            return ("REJECT_TYPE_NOT_PLAIN_OBJECT");
        }
        else if (Object.keys(entry).length === 0) {
            return (criteria.empty ? null : "REJECT_VALUE_EMPTY");
        }
        else if (!this.hasRequiredKeys(criteria, entry)) {
            return ("REJECT_VALUE_MISSING_KEY");
        }
        else if (!this.hasDefinedKeys(criteria, entry)) {
            return ("REJECT_VALUE_INVALID_KEY");
        }
        ;
        return null;
    }
    getCheckingTasks(criteria, entry) {
        let checkTasks = [];
        const keys = Object.keys(entry);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            checkTasks.push({
                criteria: criteria.struct[key],
                entry: entry[key]
            });
        }
        return (checkTasks);
    }
}
exports.StructFormat = StructFormat;
