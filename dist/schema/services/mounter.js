"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounter = mounter;
exports.isMountedCriteria = isMountedCriteria;
const formats_1 = require("../formats");
const handlers_1 = require("../handlers");
const testers_1 = require("../../testers");
const utils_1 = require("../../utils");
function mounter(mapper, definedCriteria) {
    let mountedCriteria = {};
    let queue = [{ definedCriteria, mountedCriteria }];
    mapper.add(null, mountedCriteria, {
        pathParts: ["root"]
    });
    while (queue.length > 0) {
        const { definedCriteria, mountedCriteria } = queue.pop();
        const format = formats_1.formats[definedCriteria.type];
        if (!format)
            throw new utils_1.Err("Criteria mounting", "Type '" + String(definedCriteria.type) + "' is unknown.");
        Object.assign(mountedCriteria, formats_1.staticTunableCriteria, format.defaultCriteria, definedCriteria);
        if (format.mounting)
            format.mounting(queue, mapper, definedCriteria, mountedCriteria);
        Object.assign(mountedCriteria, {
            [handlers_1.mapperSymbol]: mapper
        });
    }
    return (mountedCriteria);
}
;
function isMountedCriteria(obj) {
    return ((0, testers_1.isPlainObject)(obj) && Reflect.has(obj, handlers_1.mapperSymbol));
}
