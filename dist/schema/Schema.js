"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
const services_1 = require("./services");
const handlers_1 = require("./handlers");
/**
 * Represents a schema for data validation, including the validation criteria structure.
 */
class Schema {
    /**
     * Initializes a new schema with the provided validation criteria.
     *
     * @param criteria - The definition of validation criteria.
     * Once the class is instantiated, modifying these criteria will have no effect.
     */
    constructor(criteria) {
        this.mapper = new handlers_1.Mapper();
        const clonedCriteria = (0, services_1.cloner)(criteria);
        const mountedCriteria = (0, services_1.mounter)(this.mapper, clonedCriteria);
        this.criteria = mountedCriteria;
    }
    /**
     * Validates the provided data against the schema.
     *
     * @param value - The data to be validated.
     * @param onReject - (Optional) A callback function triggered if validation fails.
     *
     * @returns `true` if the value is **valid**, otherwise `false`.
     * This function acts as a **type guard**, ensuring that the validated data conforms
     * to `GuardedCriteria<T>`. See the example below for usage.
     */
    validate(value) {
        const reject = (0, services_1.checker)(this.criteria, value);
        return (!reject);
    }
    /**
     * Validates the provided data against the schema.
     *
     * @param value - The data to be validated.
     *
     * @returns An object containing:
     * - `{ reject: SchemaReject, value: null }` if the data is **invalid**.
     * - `{ reject: null, value: GuardedCriteria<T> }` if the data is **valid**.
     */
    evaluate(value) {
        const reject = (0, services_1.checker)(this.criteria, value);
        if (reject)
            return ({ reject, value: null });
        return { reject: null, value };
    }
}
exports.Schema = Schema;
