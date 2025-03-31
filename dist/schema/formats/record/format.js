"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordFormat = void 0;
const testers_1 = require("../../../testers");
exports.RecordFormat = {
    defaultCriteria: {
        empty: true
    },
    mount(chunk, criteria) {
        chunk.push({
            node: criteria.key,
            partPaths: {
                explicit: ["key"],
                implicit: []
            }
        });
        chunk.push({
            node: criteria.value,
            partPaths: {
                explicit: ["value"],
                implicit: ["%", "string", "symbol"]
            }
        });
    },
    check(chunk, criteria, data) {
        if (!(0, testers_1.isPlainObject)(data)) {
            return ("TYPE_NOT_PLAIN_OBJECT");
        }
        const keys = Reflect.ownKeys(data);
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
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            chunk.push({
                data: key,
                node: criteria.key
            }, {
                data: data[key],
                node: criteria.value
            });
        }
        return (null);
    }
};
