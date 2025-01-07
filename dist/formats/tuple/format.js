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
    }
    mountCriteria(definedCriteria, mountedCriteria) {
        return (Object.assign(mountedCriteria, this.baseCriteria, definedCriteria));
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
    checkValue(mountedCriteria, value) {
        const criteria = mountedCriteria;
        if (value === undefined) {
            const isCompliant = !criteria.require;
            return {
                error: isCompliant ? null : { code: "TUPLE_IS_UNDEFINED" }
            };
        }
        else if (!(0, testers_1.isObject)(value)) {
            return {
                error: { code: "TUPLE_NOT_OBJECT" }
            };
        }
        else if (!(0, testers_1.isArray)(value)) {
            return {
                error: { code: "TUPLE_NOT_ARRAY" }
            };
        }
        else if (!value.length) {
            return {
                error: criteria.empty ? null : { code: "TUPLE_IS_EMPTY" }
            };
        }
        else if (criteria.min !== undefined && value.length < criteria.min) {
            return {
                error: { code: "TUPLE_INFERIOR_MIN_LENGTH" }
            };
        }
        else if (criteria.max !== undefined && value.length > criteria.max) {
            return {
                error: { code: "TUPLE_SUPERIOR_MAX_LENGTH" }
            };
        }
        else if (criteria.min === undefined && criteria.max === undefined) {
            if (value.length < criteria.tuple.length) {
                return {
                    error: { code: "TUPLE_INFERIOR_TUPLE_LENGTH" }
                };
            }
        }
        else if (value.length > criteria.tuple.length) {
            return {
                error: { code: "TUPLE_SUPERIOR_TUPLE_LENGTH" }
            };
        }
        return { error: null };
    }
    getCheckingTasks(mountedCriteria, value) {
        let checkTasks = [];
        for (let i = 0; i < value.length; i++) {
            checkTasks.push({
                mountedCriteria: mountedCriteria.tuple[i],
                value: value[i]
            });
        }
        return (checkTasks);
    }
}
exports.TupleFormat = TupleFormat;
