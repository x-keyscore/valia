"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounter = mounter;
exports.isMountedCriteria = isMountedCriteria;
const formats_1 = require("./formats");
const Registry_1 = require("./Registry");
const utils_1 = require("../utils");
function checkCriteria(format, definedCriteria) {
}
function mounter(definedCriteria) {
    const registry = new Registry_1.Registry();
    let mountedCriteria = {};
    let queue = [{ definedCriteria, mountedCriteria }];
    registry.add(null, mountedCriteria, {
        pathParts: ["root"]
    });
    while (queue.length > 0) {
        const { definedCriteria, mountedCriteria } = queue.pop();
        const format = formats_1.formats[definedCriteria.type];
        if (!format)
            throw new utils_1.LibraryError("Criteria mounting", "Format type '" + String(definedCriteria.type) + "' is unknown");
        Object.assign(mountedCriteria, formats_1.defaultVariantCriteria, format.defaultCriteria, definedCriteria);
        if (format.mounting)
            format.mounting(queue, registry, definedCriteria, mountedCriteria);
    }
    Object.assign(mountedCriteria, {
        [Registry_1.registrySymbol]: registry
    });
    return (mountedCriteria);
}
;
function isMountedCriteria(criteria) {
    return (Reflect.has(criteria, Registry_1.registrySymbol));
}
