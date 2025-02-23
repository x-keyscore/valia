"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordFormat = void 0;
const testers_1 = require("../../../testers");
exports.RecordFormat = {
    defaultCriteria: {
        empty: false
    },
    mounting(queue, path, criteria) {
        queue.push({
            prevNode: criteria,
            prevPath: path,
            currNode: criteria.key,
            partPath: {
                explicit: ["key"],
                implicit: []
            }
        }, {
            prevNode: criteria,
            prevPath: path,
            currNode: criteria.value,
            partPath: {
                explicit: ["value"],
                implicit: ["%", "string", "symbol"]
            }
        });
    },
    checking(queue, path, criteria, value) {
        if (!(0, testers_1.isPlainObject)(value)) {
            return ("TYPE_NOT_PLAIN_OBJECT");
        }
        const keys = Object.keys(value);
        const totalKeys = keys.length;
        if (totalKeys === 0) {
            return (criteria.empty ? null : "VALUE_EMPTY");
        }
        else if (criteria.min !== undefined && totalKeys < criteria.min) {
            return ("VALUE_INFERIOR_MIN");
        }
        else if (criteria.max !== undefined && totalKeys > criteria.max) {
            return ("VALUE_SUPERIOR_MAX");
        }
        const criteriaKey = criteria.key;
        const criteriaValue = criteria.value;
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            queue.push({
                prevPath: path,
                currNode: criteriaKey,
                value: key
            });
            queue.push({
                prevPath: path,
                currNode: criteriaValue,
                value: value[key]
            });
        }
        return (null);
    }
};
