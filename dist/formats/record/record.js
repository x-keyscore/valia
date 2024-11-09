"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordFormat = void 0;
const testers_1 = require("../../testers");
const AbstractFormat_1 = require("../AbstractFormat");
class RecordFormat extends AbstractFormat_1.AbstractFormat {
    predefinedCriteria = {};
    constructor(criteria) {
        super(criteria);
    }
    hasRequiredKeys(inputRecord) {
        const expectedObject = this.criteria.record;
        const requiredKeys = Object.entries(expectedObject)
            .filter(([key, value]) => value.require === true || value.require === undefined)
            .map(([key]) => key);
        const inputKeys = Object.keys(inputRecord);
        for (const key of requiredKeys) {
            if (!inputKeys.includes(key))
                return (false);
        }
        return (true);
    }
    hasDefinedKeys(inputRecord) {
        const expectedRecord = this.criteria.record;
        const inputKeys = Object.keys(inputRecord);
        const expectedKeys = Object.keys(expectedRecord);
        for (const key of inputKeys) {
            if (!expectedKeys.includes(key))
                return (false);
        }
        return (true);
    }
    checker(input) {
        const criteria = this.criteria;
        if (input === undefined) {
            const isCompliant = !criteria.require;
            return {
                error: isCompliant ? null : { code: "RECORD_IS_UNDEFINED" }
            };
        }
        else if (!(0, testers_1.isObject)(input)) {
            return {
                error: { code: "RECORD_NOT_OBJECT" }
            };
        }
        else if (!(0, testers_1.isPlainObject)(input)) {
            return {
                error: { code: "RECORD_NOT_PLAIN_OBJECT" }
            };
        }
        else if (!this.hasRequiredKeys(input)) {
            return {
                error: { code: "RECORD_REQUIRE_KEY" }
            };
        }
        else if (!this.hasDefinedKeys(input)) {
            return {
                error: { code: "RECORD_DEFINED_KEY" }
            };
        }
        ;
        return {
            error: null
        };
    }
}
exports.RecordFormat = RecordFormat;
