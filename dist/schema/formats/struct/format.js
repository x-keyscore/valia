"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructFormat = void 0;
const mounter_1 = require("../../services/mounter");
const testers_1 = require("../../../testers");
function isStructCriteria(obj) {
    return ((0, testers_1.isPlainObject)(obj) && typeof (obj === null || obj === void 0 ? void 0 : obj.type) !== "string");
}
exports.StructFormat = {
    defaultCriteria: {},
    mounting(queue, mapper, definedCriteria, mountedCriteria) {
        const acceptedKeys = Reflect.ownKeys(definedCriteria.struct);
        const optionalKeys = acceptedKeys.filter(key => { var _a; return !((_a = definedCriteria === null || definedCriteria === void 0 ? void 0 : definedCriteria.optional) === null || _a === void 0 ? void 0 : _a.includes(key)); });
        Object.assign(mountedCriteria, {
            acceptedKeys: acceptedKeys,
            requiredKeys: optionalKeys
        });
        for (let i = 0; i < acceptedKeys.length; i++) {
            const key = acceptedKeys[i];
            if ((0, mounter_1.isMountedCriteria)(definedCriteria.struct[key])) {
                mapper.merge(mountedCriteria, definedCriteria.struct[key], {
                    pathParts: ["struct", key.toString()]
                });
                mountedCriteria.struct[key] = definedCriteria.struct[key];
            }
            else if (isStructCriteria(definedCriteria.struct[key])) {
                definedCriteria.struct[key] = {
                    type: "struct",
                    struct: definedCriteria.struct[key]
                };
                mapper.add(mountedCriteria, mountedCriteria.struct[key], {
                    pathParts: ["struct", key.toString()]
                });
                queue.push({
                    definedCriteria: definedCriteria.struct[key],
                    mountedCriteria: mountedCriteria.struct[key]
                });
            }
            else {
                mapper.add(mountedCriteria, mountedCriteria.struct[key], {
                    pathParts: ["struct", key.toString()]
                });
                queue.push({
                    definedCriteria: definedCriteria.struct[key],
                    mountedCriteria: mountedCriteria.struct[key]
                });
            }
        }
    },
    hasRequiredKeys(mountedCriteria, inputKeys) {
        const requiredKeys = mountedCriteria.requiredKeys;
        return (requiredKeys.length <= inputKeys.length && requiredKeys.every((key) => inputKeys.includes(key)));
    },
    hasAcceptedKeys(mountedCriteria, inputKeys) {
        const definedKeys = mountedCriteria.acceptedKeys;
        return (inputKeys.length <= definedKeys.length && inputKeys.every((key) => definedKeys.includes(key)));
    },
    checking(queue, criteria, value) {
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
                criteria: criteria.struct[key],
                value: value[key]
            });
        }
        return (null);
    }
};
