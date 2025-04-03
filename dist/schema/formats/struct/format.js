"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructFormat = void 0;
const testers_1 = require("../../../testers");
function isShorthandStruct(obj) {
    return ((0, testers_1.isPlainObject)(obj) && typeof (obj === null || obj === void 0 ? void 0 : obj.type) !== "string");
}
exports.StructFormat = {
    defaultCriteria: {},
    mount(chunk, criteria) {
        const optionalKeys = criteria.optional;
        const acceptedKeys = Reflect.ownKeys(criteria.struct);
        const requiredKeys = acceptedKeys.filter(key => !(optionalKeys === null || optionalKeys === void 0 ? void 0 : optionalKeys.includes(key)));
        Object.assign(criteria, {
            acceptedKeys: new Set(acceptedKeys),
            requiredKeys: new Set(requiredKeys)
        });
        for (let i = 0; i < acceptedKeys.length; i++) {
            const key = acceptedKeys[i];
            if (isShorthandStruct(criteria.struct[key])) {
                criteria.struct[key] = {
                    type: "struct",
                    struct: criteria.struct[key]
                };
            }
            chunk.push({
                node: criteria.struct[key],
                partPaths: {
                    explicit: ["struct", key],
                    implicit: ["&", key]
                }
            });
        }
    },
    check(chunk, criteria, data) {
        if (!(0, testers_1.isPlainObject)(data)) {
            return ("TYPE_PLAIN_OBJECT_REQUIRED");
        }
        const { acceptedKeys, requiredKeys } = criteria;
        const keys = Reflect.ownKeys(data);
        if (keys.length < requiredKeys.size) {
            return ("DATA_KEYS_MISSING");
        }
        let requiredLeft = requiredKeys.size;
        for (let i = keys.length - 1; i >= 0; i--) {
            const key = keys[i];
            if (!acceptedKeys.has(key)) {
                return ("DATA_KEYS_INVALID");
            }
            if (requiredKeys.has(key)) {
                requiredLeft--;
            }
            else if (requiredLeft > i) {
                return ("DATA_KEYS_MISSING");
            }
            chunk.push({
                data: data[key],
                node: criteria.struct[key]
            });
        }
        return (null);
    }
};
