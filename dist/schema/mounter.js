"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadataSymbol = void 0;
exports.mounter = mounter;
exports.isMountedCriteria = isMountedCriteria;
const formats_1 = require("../formats");
const utils_1 = require("../utils");
const register_1 = require("./register");
exports.metadataSymbol = Symbol('metadata');
function checkCriteria(format, definedCriteria) {
}
function mounter(definedCriteria) {
    const register = new register_1.Register();
    let mountedCriteria = {};
    let queue = [{ definedCriteria, mountedCriteria }];
    const timeStart = performance.now();
    while (queue.length > 0) {
        const { definedCriteria, mountedCriteria } = queue.pop();
        const format = formats_1.formats[definedCriteria.type];
        if (!format)
            throw new utils_1.LibraryError("Criteria mounting", "Format type '" + String(definedCriteria.type) + "' is unknown");
        Object.assign(mountedCriteria, formats_1.defaultVariantCriteria, format.defaultCriteria, definedCriteria);
        if (format.mounting)
            format.mounting(queue, register, definedCriteria, mountedCriteria);
    }
    const timeEnd = performance.now();
    const timeTaken = timeEnd - timeStart;
    Object.assign(mountedCriteria, {
        [exports.metadataSymbol]: {
            mountingTime: `${timeTaken.toFixed(2)}ms`,
            register
        }
    });
    return (mountedCriteria);
}
;
function isMountedCriteria(criteria) {
    return (Reflect.has(criteria, exports.metadataSymbol));
}
