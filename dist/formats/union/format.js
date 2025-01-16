"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnionFormat = void 0;
const formats_1 = require("../formats");
exports.UnionFormat = {
    defaultCriteria: {
        empty: false
    },
    mountCriteria(definedCriteria, mountedCriteria) {
        return (Object.assign(mountedCriteria, formats_1.formatDefaultCriteria, this.defaultCriteria, definedCriteria));
    },
    getMountingTasks(definedCriteria, mountedCriteria) {
        let mountingTasks = [];
        for (let i = 0; i < definedCriteria.union.length; i++) {
            const definedCriteriaItem = definedCriteria.union[i];
            if ((0, formats_1.isMountedCriteria)(definedCriteriaItem)) {
                mountedCriteria.union[i] = definedCriteriaItem;
            }
            else {
                mountingTasks.push({
                    definedCriteria: definedCriteriaItem,
                    mountedCriteria: mountedCriteria.union[i]
                });
            }
        }
        return (mountingTasks);
    },
    checkValue(criteria, value) {
        return (null);
    },
    getCheckingTasks(criteria, value) {
        let checkTasks = [];
        const unionLength = criteria.union.length;
        const link = {
            isClose: false,
            totalLinks: unionLength,
            totalRejected: 0,
        };
        for (let i = 0; i < unionLength; i++) {
            checkTasks.push({
                criteria: criteria.union[i],
                value: value,
                link
            });
        }
        return (checkTasks);
    },
};
