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
            chunk.add({
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
            return ("TYPE_NOT_ARRAY");
        }
        const dataLength = data.length;
        if (dataLength < criteria.tuple.length) {
            return ("DATA_INFERIOR_TUPLE");
        }
        else if (dataLength > criteria.tuple.length) {
            return ("DATA_SUPERIOR_TUPLE");
        }
        for (let i = 0; i < dataLength; i++) {
            chunk.addTask({
                data: data[i],
                node: criteria.tuple[i]
            });
        }
        return (null);
    }
};
