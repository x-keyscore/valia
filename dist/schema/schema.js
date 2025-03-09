"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
const managers_1 = require("./managers");
const services_1 = require("./services");
const formats_1 = require("./formats");
const utils_1 = require("../utils");
/**
 * Represents a schema for data validation, including the validation criteria structure.
 */
class Schema {
    initiate(definedCriteria) {
        this.managers.formats.set(formats_1.nativeFormats);
        const clonedCriteria = (0, services_1.cloner)(definedCriteria);
        this.mountedCriteria = (0, services_1.mounter)(this.managers, clonedCriteria);
    }
    constructor(criteria) {
        this.managers = {
            registry: (0, managers_1.registryManager)(),
            formats: (0, managers_1.formatsManager)(),
            events: (0, managers_1.eventsManager)()
        };
        // Deferred initiation of criteria if not called directly,
        // as plugins (or custom extensions) may set up specific
        // rules and actions for the preparation of the criteria.
        if (new.target === Schema) {
            this.initiate(criteria);
        }
    }
    /**
     * Properties representing the root of the mounted criteria,
     * which can be used in other schemas.
     */
    get criteria() {
        if (!this.mountedCriteria) {
            throw new utils_1.Issue("Schema", "Criteria are not initialized.");
        }
        return (this.mountedCriteria);
    }
    /**
     * Validates the provided data against the schema.
     *
     * @param value - The data to be validated.
     *
     * @returns `true` if the value is **valid**, otherwise `false`.
     * This function acts as a **type guard**, ensuring that
     * the validated data conforms to `GuardedCriteria<T>`.
     */
    validate(value) {
        const reject = (0, services_1.checker)(this.managers, this.criteria, value);
        return (!reject);
    }
    /**
     * Evaluates the provided data against the schema.
     *
     * @param value - The data to be evaluated.
     *
     * @returns An object containing:
     * - `{ reject: SchemaReject, value: null }` if the data is **invalid**.
     * - `{ reject: null, value: GuardedCriteria<T> }` if the data is **valid**.
     */
    evaluate(value) {
        const reject = (0, services_1.checker)(this.managers, this.criteria, value);
        if (reject) {
            return ({ reject, value: null });
        }
        return ({ reject: null, value });
    }
}
exports.Schema = Schema;
