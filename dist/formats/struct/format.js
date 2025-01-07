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
        return (Object.assign(mountedCriteria, this.baseCriteria, definedCriteria, { requiredKeys, definedKeys }));
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
    objectLength(obj) {
        return (Object.keys(obj).length + Object.getOwnPropertySymbols(obj).length);
    }
    checkValue(mountedCriteria, value) {
        const criteria = mountedCriteria;
        if (value === undefined) {
            return {
                error: !criteria.require ? null : { code: "STRUCT_IS_UNDEFINED" }
            };
        }
        else if (!(0, testers_1.isObject)(value)) {
            return {
                error: { code: "STRUCT_NOT_OBJECT" }
            };
        }
        else if (!(0, testers_1.isPlainObject)(value)) {
            return {
                error: { code: "STRUCT_NOT_PLAIN_OBJECT" }
            };
        }
        else if (this.objectLength(value) === 0) {
            return {
                error: criteria.empty ? null : { code: "STRUCT_IS_EMPTY" }
            };
        }
        else if (!this.hasRequiredKeys(criteria, value)) {
            return {
                error: { code: "STRUCT_REQUIRE_KEY" }
            };
        }
        else if (!this.hasDefinedKeys(criteria, value)) {
            return {
                error: { code: "STRUCT_DEFINED_KEY" }
            };
        }
        ;
        return {
            error: null
        };
    }
    getCheckingTasks(mountedCriteria, value) {
        let checkTasks = [];
        const keys = Object.keys(value);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            checkTasks.push({
                mountedCriteria: mountedCriteria.struct[key],
                value: value[key]
            });
        }
        return (checkTasks);
    }
}
exports.StructFormat = StructFormat;
