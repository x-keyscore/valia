"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayFormat = void 0;
const testers_1 = require("../../../testers");
exports.ArrayFormat = {
    defaultCriteria: {
        empty: true
    },
    mount(chunk, criteria) {
        chunk.add({
            node: criteria.item,
            partPaths: {
                explicit: ["item"],
                implicit: ["%", "number"],
            }
        });
    },
    check(chunk, criteria, data) {
        if (!(0, testers_1.isArray)(data)) {
            return ("TYPE_NOT_ARRAY");
        }
        const dataLength = data.length;
        if (!dataLength) {
            return (criteria.empty ? null : "DATA_EMPTY");
        }
        else if (criteria.min !== undefined && dataLength < criteria.min) {
            return ("DATA_INFERIOR_MIN");
        }
        else if (criteria.max !== undefined && dataLength > criteria.max) {
            return ("DATA_SUPERIOR_MAX");
        }
        for (let i = 0; i < dataLength; i++) {
            chunk.addTask({
                data: data[i],
                node: criteria.item
            });
        }
        return (null);
    }
};
