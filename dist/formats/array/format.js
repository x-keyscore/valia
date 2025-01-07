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
    }
    mountCriteria(definedCriteria, mountedCriteria) {
        return (Object.assign(mountedCriteria, this.baseCriteria, definedCriteria));
    }
    getMountingTasks(definedCriteria, mountedCriteria) {
        let buildTasks = [{
                definedCriteria: definedCriteria.item,
                mountedCriteria: mountedCriteria.item
            }];
        return (buildTasks);
    }
    checkValue(mountedCriteria, value) {
        const criteria = mountedCriteria;
        if (value === undefined) {
            const isCompliant = !criteria.require;
            return {
                error: isCompliant ? null : { code: "ARRAY_IS_UNDEFINED" }
            };
        }
        else if (!(0, testers_1.isObject)(value)) {
            return {
                error: { code: "ARRAY_NOT_OBJECT" }
            };
        }
        else if (!(0, testers_1.isArray)(value)) {
            return {
                error: { code: "ARRAY_NOT_ARRAY" }
            };
        }
        else if (!value.length) {
            return {
                error: criteria.empty ? null : { code: "ARRAY_IS_EMPTY" }
            };
        }
        else if (criteria.min !== undefined && value.length < criteria.min) {
            return {
                error: { code: "ARRAY_INFERIOR_MIN_LENGTH" }
            };
        }
        else if (criteria.max !== undefined && value.length > criteria.max) {
            return {
                error: { code: "ARRAY_SUPERIOR_MAX_LENGTH" }
            };
        }
        return { error: null };
    }
    getCheckingTasks(mountedCriteria, value) {
        let checkTasks = [];
        for (let i = 0; i < value.length; i++) {
            checkTasks.push({
                mountedCriteria: mountedCriteria.item,
                value: value[i]
            });
        }
        return (checkTasks);
    }
}
exports.ArrayFormat = ArrayFormat;
