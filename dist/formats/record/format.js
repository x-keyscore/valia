"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordFormat = void 0;
const testers_1 = require("../../testers");
const AbstractFormat_1 = require("../AbstractFormat");
const schema_1 = require("../../schema");
class RecordFormat extends AbstractFormat_1.AbstractFormat {
    constructor() {
        super({
            empty: false
        });
    }
    mountCriteria(definedCriteria, mountedCriteria) {
        return (Object.assign(mountedCriteria, this.baseCriteria, definedCriteria));
    }
    getMountingTasks(definedCriteria, mountedCriteria) {
        let buildTasks = [];
        buildTasks.push({
            definedCriteria: definedCriteria.key,
            mountedCriteria: mountedCriteria.key
        });
        if ((0, schema_1.isSchemaInstance)(definedCriteria.value)) {
            mountedCriteria.value = definedCriteria.value.mountedCriteria;
        }
        else {
            buildTasks.push({
                definedCriteria: definedCriteria.value,
                mountedCriteria: mountedCriteria.value
            });
        }
        return (buildTasks);
    }
    objectLength(obj) {
        return (Object.keys(obj).length + Object.getOwnPropertySymbols(obj).length);
    }
    checkValue(mountedCriteria, value) {
        const criteria = mountedCriteria;
        if (value === undefined) {
            return {
                error: !criteria.require ? null : { code: "RECORD_IS_UNDEFINED" }
            };
        }
        else if (!(0, testers_1.isObject)(value)) {
            return {
                error: { code: "RECORD_NOT_OBJECT" }
            };
        }
        else if (!(0, testers_1.isPlainObject)(value)) {
            return {
                error: { code: "RECORD_NOT_PLAIN_OBJECT" }
            };
        }
        const valueLength = this.objectLength(value);
        if (valueLength === 0) {
            return {
                error: criteria.empty ? null : { code: "RECORD_IS_EMPTY" }
            };
        }
        else if (criteria.min !== undefined && valueLength < criteria.min) {
            return {
                error: { code: "RECORD_INFERIOR_MIN_LENGTH" }
            };
        }
        else if (criteria.max !== undefined && valueLength > criteria.max) {
            return {
                error: { code: "RECORD_SUPERIOR_MAX_LENGTH" }
            };
        }
        return {
            error: null
        };
    }
    getCheckingTasks(mountedCriteria, value) {
        let checkTasks = [];
        const keys = Object.keys(value);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            checkTasks.push({
                mountedCriteria: mountedCriteria.key,
                value: key
            });
            checkTasks.push({
                mountedCriteria: mountedCriteria.value,
                value: value[key]
            });
        }
        return (checkTasks);
    }
}
exports.RecordFormat = RecordFormat;
