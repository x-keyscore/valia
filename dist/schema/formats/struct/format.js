"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructFormat = void 0;
const mounter_1 = require("../../mounter");
const testers_1 = require("../../../testers");
exports.StructFormat = {
    defaultCriteria: {},
    mounting(queue, mapper, definedCriteria, mountedCriteria) {
        const validKeys = Reflect.ownKeys(definedCriteria.struct);
        const optionalKeys = definedCriteria.optional;
        Object.assign(mountedCriteria, {
            validKeys: validKeys,
            requiredKeys: optionalKeys ? validKeys.filter(key => !optionalKeys.includes(key)) : validKeys
        });
        for (let i = 0; i < validKeys.length; i++) {
            const key = validKeys[i];
            if ((0, mounter_1.isMountedCriteria)(definedCriteria.struct[key])) {
                mapper.merge(mountedCriteria, definedCriteria.struct[key], {
                    pathParts: ["struct", key.toString()]
                });
                mountedCriteria.struct[key] = definedCriteria.struct[key];
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
    hasValidKeys(mountedCriteria, inputKeys) {
        const definedKeys = mountedCriteria.validKeys;
        return (inputKeys.length <= definedKeys.length && inputKeys.every((key) => definedKeys.includes(key)));
    },
    checking(queue, criteria, value) {
        if (!(0, testers_1.isPlainObject)(value)) {
            return ("TYPE_NOT_PLAIN_OBJECT");
        }
        const keys = Reflect.ownKeys(value);
        if (!this.hasValidKeys(criteria, keys)) {
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
