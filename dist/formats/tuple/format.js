"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TupleFormat = void 0;
const formats_1 = require("../formats");
const testers_1 = require("../../testers");
exports.TupleFormat = {
    defaultCriteria: {
        empty: false
    },
    mountCriteria(definedCriteria, mountedCriteria) {
        return (Object.assign(mountedCriteria, formats_1.formatDefaultCriteria, this.defaultCriteria, definedCriteria));
    },
    getMountingTasks(definedCriteria, mountedCriteria) {
        let mountingTasks = [];
        for (let i = 0; i < definedCriteria.tuple.length; i++) {
            const definedCriteriaItem = definedCriteria.tuple[i];
            if ((0, formats_1.isMountedCriteria)(definedCriteriaItem)) {
                mountedCriteria.tuple[i] = definedCriteriaItem;
            }
            else {
                mountingTasks.push({
                    definedCriteria: definedCriteriaItem,
                    mountedCriteria: mountedCriteria.tuple[i]
                });
            }
        }
        return (mountingTasks);
    },
    checkValue(criteria, value) {
        if (!(0, testers_1.isArray)(value)) {
            return ("TYPE_NOT_ARRAY");
        }
        const valueLength = value.length;
        if (!valueLength) {
            return (criteria.empty ? null : "VALUE_EMPTY");
        }
        else if (valueLength < criteria.tuple.length) {
            return ("VALUE_INFERIOR_TUPLE");
        }
        else if (valueLength > criteria.tuple.length) {
            return ("VALUE_SUPERIOR_TUPLE");
        }
        return (null);
    },
    getCheckingTasks(criteria, value) {
        let checkTasks = [];
        for (let i = 0; i < value.length; i++) {
            checkTasks.push({
                criteria: criteria.tuple[i],
                value: value[i]
            });
        }
        return (checkTasks);
    }
};
