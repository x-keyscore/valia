"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TupleFormat = void 0;
const testers_1 = require("../../../testers");
exports.TupleFormat = {
    defaultCriteria: {
        empty: false
    },
    mounting(queue, path, criteria) {
        for (let i = 0; i < criteria.tuple.length; i++) {
            queue.push({
                prevCriteria: criteria,
                prevPath: path,
                criteria: criteria.tuple[i],
                pathSegments: {
                    explicit: ["tuple", i],
                    implicit: ["&", i]
                }
            });
        }
    },
    checking(queue, path, criteria, value) {
        if (!(0, testers_1.isArray)(value)) {
            return ("TYPE_NOT_ARRAY");
        }
        const valueLength = value.length;
        if (valueLength < criteria.tuple.length) {
            return ("VALUE_INFERIOR_TUPLE");
        }
        else if (valueLength > criteria.tuple.length) {
            return ("VALUE_SUPERIOR_TUPLE");
        }
        for (let i = 0; i < value.length; i++) {
            queue.push({
                prevPath: path,
                criteria: criteria.tuple[i],
                value: value[i]
            });
        }
        return (null);
    }
};
