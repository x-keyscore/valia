"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
const mounter_1 = require("./mounter");
const checker_1 = require("./checker");
/**
 * Represents the validation criteria structure and its associated functions.
 */
class Schema {
    /**
     * @param definedCriteria Definition of validation criteria.
     * Once the class has been instantiated, modifying
     * these criteria will have no effect.
     *
     * @example
     * ```ts
     * const userSchema = new Schema({
     *     type: "struct",
     *     struct: {
     *         name: { type: "string" }
     *     }
     * });
     * ```
     */
    constructor(definedCriteria) {
        const clonedCriteria = structuredClone(definedCriteria);
        const mountedCriteria = (0, mounter_1.schemaMounter)(clonedCriteria);
        this.criteria = mountedCriteria;
    }
    /**
     * @param entry Data to be validated
     *
     * @returns `true` if entry is compliant, otherwise `false`. For **Typescript** users,
     * this function is a guard type that predicts validated data, see example below.
     *
     * @example
     * ```ts
     * const userSchema = new Schema({
     *     type: "struct",
     *     struct: {
     *         name: { type: "string" }
     *     }
     * });
     *
     * let user = { name: "Tintin" };
     *
     * if (userSchema.guard(user)) {
     *     // The “user” type is : { name: string }
     * }
     * ```
     */
    guard(entry) {
        const error = (0, checker_1.schemaChecker)(this.criteria, entry);
        return (!error);
    }
    /**
     * @param entry Data to be validated
     *
     * @returns `null` if entry is compliant, otherwise `SchemaCheckReject`.
     *
     * @example
     * ```ts
     * const userSchema = new Schema({
     *     type: "struct",
     *     struct: {
     *         name: { type: "string" }
     *     }
     * });
     *
     * let user = { name: 667 };
     *
     * const reject = userSchema.check(user);
     *
     * if (reject) {
     *     console.log("The " + reject.type + " type was rejected with the following code : " + reject.code);
     * }
     * ```
     */
    check(entry) {
        const error = (0, checker_1.schemaChecker)(this.criteria, entry);
        return (error);
    }
}
exports.Schema = Schema;
