"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSymbol = void 0;
exports.mounter = mounter;
exports.isMountedCriteria = isMountedCriteria;
const formats_1 = require("./formats");
const utils_1 = require("../utils");
const register_1 = require("./register");
exports.registerSymbol = Symbol('register');
function checkCriteria(format, definedCriteria) {
}
function mounter(definedCriteria) {
    const register = new register_1.Register();
    let mountedCriteria = {};
    let queue = [{ definedCriteria, mountedCriteria }];
    while (queue.length > 0) {
        // RETRIVE THE PROPERTIES OF THE CURRENT TASK
        const { definedCriteria, mountedCriteria } = queue.pop();
        // RETRIVE THE FORMAT
        const format = formats_1.formats[definedCriteria.type];
        if (!format)
            throw new utils_1.LibraryError("Criteria mounting", "Format type '" + String(definedCriteria.type) + "' is unknown");
        // ASSIGNING DEFAULT CRITERIA AND DEFINED CRITERIA ON THE MOUNTED CRITERIA REFERENCE
        Object.assign(mountedCriteria, formats_1.defaultVariantCriteria, format.defaultCriteria, definedCriteria);
        // FORMAT SPECIFIC MOUNTING
        if (format.mounting)
            format.mounting(queue, register, definedCriteria, mountedCriteria);
    }
    // REGISTER ASSIGNMENT ON THE ROOT OF RHE MOUNTED CRITERIA
    Object.assign(mountedCriteria, {
        [exports.registerSymbol]: register
    });
    return (mountedCriteria);
}
;
function isMountedCriteria(criteria) {
    return (Reflect.has(criteria, exports.registerSymbol));
}
