"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructFormat = void 0;
const testers_1 = require("../../../testers");
function isSubStruct(obj) {
    return ((0, testers_1.isPlainObject)(obj) && typeof (obj === null || obj === void 0 ? void 0 : obj.type) !== "string");
}
exports.StructFormat = {
    defaultCriteria: {},
    mounting(queue, path, criteria) {
        const acceptedKeys = Reflect.ownKeys(criteria.struct);
        const requiredKeys = acceptedKeys.filter(key => { var _a; return !((_a = criteria === null || criteria === void 0 ? void 0 : criteria.optional) === null || _a === void 0 ? void 0 : _a.includes(key)); });
        Object.assign(criteria, { acceptedKeys, requiredKeys });
        for (let i = 0; i < acceptedKeys.length; i++) {
            const key = acceptedKeys[i];
            if (isSubStruct(criteria.struct[key])) {
                criteria.struct[key] = {
                    type: "struct",
                    struct: criteria.struct[key]
                };
            }
            queue.push({
                prevNode: criteria,
                prevPath: path,
                currNode: criteria.struct[key],
                partPath: {
                    explicit: ["struct", key],
                    implicit: ["&", key]
                }
            });
        }
    },
    hasRequiredKeys(criteria, keys) {
        const requiredKeys = criteria.requiredKeys;
        return (requiredKeys.length <= keys.length && requiredKeys.every((key) => keys.includes(key)));
    },
    hasAcceptedKeys(criteria, keys) {
        const acceptedKeys = criteria.acceptedKeys;
        return (keys.length <= acceptedKeys.length && keys.every((key) => acceptedKeys.includes(key)));
    },
    checking(queue, path, criteria, value) {
        if (!(0, testers_1.isPlainObject)(value)) {
            return ("TYPE_NOT_PLAIN_OBJECT");
        }
        const keys = Reflect.ownKeys(value);
        if (!this.hasAcceptedKeys(criteria, keys)) {
            return ("VALUE_INVALID_KEY");
        }
        else if (!this.hasRequiredKeys(criteria, keys)) {
            return ("VALUE_MISSING_KEY");
        }
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            queue.push({
                prevPath: path,
                currNode: criteria.struct[key],
                value: value[key],
            });
        }
        return (null);
    }
};
