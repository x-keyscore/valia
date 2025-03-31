"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructFormat = void 0;
const testers_1 = require("../../../testers");
function isShorthandStruct(obj) {
    return ((0, testers_1.isPlainObject)(obj) && typeof (obj === null || obj === void 0 ? void 0 : obj.type) !== "string");
}
exports.StructFormat = {
    defaultCriteria: {},
    hasRequiredKeys(criteria, keys) {
        const requiredKeys = criteria.requiredKeys;
        return (requiredKeys.length <= keys.length && requiredKeys.every((key) => keys.includes(key)));
    },
    hasAcceptedKeys(criteria, keys) {
        const acceptedKeys = criteria.acceptedKeys;
        return (keys.length <= acceptedKeys.length && keys.every((key) => acceptedKeys.includes(key)));
    },
    mount(chunk, criteria) {
        const acceptedKeys = Reflect.ownKeys(criteria.struct);
        const requiredKeys = acceptedKeys.filter(key => { var _a; return !((_a = criteria.optional) === null || _a === void 0 ? void 0 : _a.includes(key)); });
        Object.assign(criteria, { acceptedKeys, requiredKeys });
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
            return ("TYPE_NOT_PLAIN_OBJECT");
        }
        const keys = Reflect.ownKeys(data);
        if (!this.hasAcceptedKeys(criteria, keys)) {
            return ("DATA_INVALID_KEY");
        }
        else if (!this.hasRequiredKeys(criteria, keys)) {
            return ("DATA_MISSING_KEY");
        }
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            chunk.push({
                data: data[key],
                node: criteria.struct[key]
            });
        }
        return (null);
    }
};
