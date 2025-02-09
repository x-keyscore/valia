"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnionFormat = void 0;
const mounter_1 = require("../../services/mounter");
exports.UnionFormat = {
    defaultCriteria: {
        empty: false
    },
    mounting(queue, mapper, definedCriteria, mountedCriteria) {
        for (let i = 0; i < definedCriteria.union.length; i++) {
            const definedCriteriaItem = definedCriteria.union[i];
            if ((0, mounter_1.isMountedCriteria)(definedCriteriaItem)) {
                mapper.merge(mountedCriteria, definedCriteriaItem, {
                    pathParts: [`union[${i}]`]
                });
                mountedCriteria.union[i] = definedCriteriaItem;
            }
            else {
                mapper.add(mountedCriteria, mountedCriteria.union[i], {
                    pathParts: [`union[${i}]`]
                });
                queue.push({
                    definedCriteria: definedCriteriaItem,
                    mountedCriteria: mountedCriteria.union[i]
                });
            }
        }
    },
    checking(queue, criteria, value) {
        const unionLength = criteria.union.length;
        const link = {
            finished: false,
            totalLinks: unionLength,
            totalRejected: 0
        };
        for (let i = 0; i < unionLength; i++) {
            queue.push({
                criteria: criteria.union[i],
                value,
                link
            });
        }
        return (null);
    }
};
