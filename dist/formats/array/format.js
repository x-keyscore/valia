"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayFormat = void 0;
const formats_1 = require("../formats");
const testers_1 = require("../../testers");
exports.ArrayFormat = {
    defaultCriteria: {
        empty: true
    },
    mountCriteria(definedCriteria, mountedCriteria) {
        return (Object.assign(mountedCriteria, formats_1.defaultGlobalCriteria, this.defaultCriteria, definedCriteria));
    },
    getMountingTasks(definedCriteria, mountedCriteria) {
        let mountingTasks = [];
        if ((0, formats_1.isAlreadyMounted)(definedCriteria.item)) {
            mountedCriteria.item = definedCriteria.item;
        }
        else {
            mountingTasks.push({
                definedCriteria: definedCriteria.item,
                mountedCriteria: mountedCriteria.item
            });
        }
        return (mountingTasks);
    },
    checkValue(criteria, value) {
        if (!(0, testers_1.isObject)(value)) {
            return ("TYPE_NOT_OBJECT");
        }
        else if (!(0, testers_1.isArray)(value)) {
            return ("TYPE_NOT_ARRAY");
        }
        else if (!value.length) {
            return (criteria.empty ? null : "VALUE_EMPTY");
        }
        else if (criteria.min !== undefined && value.length < criteria.min) {
            return ("VALUE_INFERIOR_MIN");
        }
        else if (criteria.max !== undefined && value.length > criteria.max) {
            return ("VALUE_SUPERIOR_MAX");
        }
        return (null);
    },
    getCheckingTasks(criteria, value) {
        let checkingTasks = [];
        for (let i = 0; i < value.length; i++) {
            checkingTasks.push({
                criteria: criteria.item,
                value: value[i]
            });
        }
        return (checkingTasks);
    }
};
