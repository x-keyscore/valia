"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounter = mounter;
exports.isMountedCriteria = isMountedCriteria;
const formats_1 = require("./formats");
const Mapper_1 = require("./Mapper");
const utils_1 = require("../utils");
function mounter(definedCriteria) {
    let mountedCriteria = {};
    let queue = [{ definedCriteria, mountedCriteria }];
    const mapper = new Mapper_1.Mapper(mountedCriteria, {
        pathParts: ["root"]
    });
    while (queue.length > 0) {
        const { definedCriteria, mountedCriteria } = queue.pop();
        const format = formats_1.formats[definedCriteria.type];
        if (!format)
            throw new utils_1.Err("Criteria mounting", "Format type '" + String(definedCriteria.type) + "' is unknown");
        Object.assign(mountedCriteria, formats_1.defaultVariantCriteria, format.defaultCriteria, definedCriteria);
        if (format.mounting)
            format.mounting(queue, mapper, definedCriteria, mountedCriteria);
        Object.assign(mountedCriteria, {
            [Mapper_1.mapperSymbol]: mapper
        });
    }
    return (mountedCriteria);
}
;
function isMountedCriteria(criteria) {
    return (Reflect.has(criteria, Mapper_1.mapperSymbol));
}
