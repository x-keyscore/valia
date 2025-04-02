"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TupleFormat = void 0;
const testers_1 = require("../../../testers");
exports.TupleFormat = {
    defaultCriteria: {
        empty: false
    },
    mount(chunk, criteria) {
        for (let i = 0; i < criteria.tuple.length; i++) {
            chunk.push({
                node: criteria.tuple[i],
                partPaths: {
                    explicit: ["tuple", i],
                    implicit: ["&", i]
                }
            });
        }
    },
    check(chunk, criteria, data) {
        if (!(0, testers_1.isArray)(data)) {
            return ("TYPE_ARRAY_REQUIRED");
        }
        const dataLength = data.length;
        if (dataLength < criteria.tuple.length) {
            return ("DATA_LENGTH_INFERIOR_MIN");
        }
        else if (dataLength > criteria.tuple.length) {
            return ("DATA_LENGTH_SUPERIOR_MAX");
        }
        for (let i = 0; i < dataLength; i++) {
            chunk.push({
                data: data[i],
                node: criteria.tuple[i]
            });
        }
        return (null);
    }
};
