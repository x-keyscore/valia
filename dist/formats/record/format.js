"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordFormat = void 0;
const formats_1 = require("../formats");
const testers_1 = require("../../testers");
exports.RecordFormat = {
    defaultCriteria: {
        empty: true
    },
    mountCriteria(definedCriteria, mountedCriteria) {
        return (Object.assign(mountedCriteria, formats_1.defaultGlobalCriteria, this.defaultCriteria, definedCriteria));
    },
    getMountingTasks(definedCriteria, mountedCriteria) {
        let mountingTasks = [];
        if ((0, formats_1.isAlreadyMounted)(definedCriteria.key)) {
            mountedCriteria.key = definedCriteria.key;
        }
        else {
            mountingTasks.push({
                definedCriteria: definedCriteria.key,
                mountedCriteria: mountedCriteria.key
            });
        }
        if ((0, formats_1.isAlreadyMounted)(definedCriteria.value)) {
            mountedCriteria.value = definedCriteria.value;
        }
        else {
            mountingTasks.push({
                definedCriteria: definedCriteria.value,
                mountedCriteria: mountedCriteria.value
            });
        }
        return (mountingTasks);
    },
    checkValue(criteria, value) {
        if (!(0, testers_1.isObject)(value)) {
            return ("TYPE_NOT_OBJECT");
        }
        else if (!(0, testers_1.isPlainObject)(value)) {
            return ("TYPE_NOT_PLAIN_OBJECT");
        }
        const totalKeys = Object.keys(value).length;
        if (totalKeys === 0) {
            return (criteria.empty ? null : "VALUE_EMPTY");
        }
        else if (criteria.min !== undefined && totalKeys < criteria.min) {
            return ("VALUE_INFERIOR_MIN");
        }
        else if (criteria.max !== undefined && totalKeys > criteria.max) {
            return ("VALUE_SUPERIOR_MAX");
        }
        return (null);
    },
    getCheckingTasks(criteria, value) {
        let checkingTasks = [];
        const keys = Object.keys(value);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            checkingTasks.push({
                criteria: criteria.key,
                value: key
            });
            checkingTasks.push({
                criteria: criteria.value,
                value: value[key]
            });
        }
        return (checkingTasks);
    },
};
