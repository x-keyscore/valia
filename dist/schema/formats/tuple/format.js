"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TupleFormat = void 0;
const mounter_1 = require("../../mounter");
const testers_1 = require("../../../testers");
exports.TupleFormat = {
    defaultCriteria: {
        empty: false
    },
    mounting(queue, register, definedCriteria, mountedCriteria) {
        for (let i = 0; i < definedCriteria.tuple.length; i++) {
            const definedCriteriaItem = definedCriteria.tuple[i];
            if ((0, mounter_1.isMountedCriteria)(definedCriteriaItem)) {
                register.merge(mountedCriteria, definedCriteriaItem, {
                    pathParts: [`tuple[${i}]`]
                });
                mountedCriteria.tuple[i] = definedCriteriaItem;
            }
            else {
                register.add(mountedCriteria, mountedCriteria.tuple[i], {
                    pathParts: [`tuple[${i}]`]
                });
                queue.push({
                    definedCriteria: definedCriteriaItem,
                    mountedCriteria: mountedCriteria.tuple[i]
                });
            }
        }
    },
    checking(queue, criteria, value) {
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
        for (let i = 0; i < value.length; i++) {
            queue.push({
                criteria: criteria.tuple[i],
                value: value[i]
            });
        }
        return (null);
    }
};
