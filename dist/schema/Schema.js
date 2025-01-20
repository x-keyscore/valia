"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
const mounter_1 = require("./mounter");
const checker_1 = require("./checker");
const cloner_1 = require("./cloner");
/**
 * Represents the validation criteria structure and its associated functions.
 */
class Schema {
    /**
     * @param criteria Definition of validation criteria.
     * Once the class has been instantiated, modifying
     * these `criteria` will have no effect.
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
    constructor(criteria) {
        const clonedCriteria = (0, cloner_1.cloner)(criteria);
        const mountedCriteria = (0, mounter_1.mounter)(clonedCriteria);
        this.criteria = mountedCriteria;
    }
    /**
     * @param value Data to be validated
     *
     * @returns `true` if value is compliant, otherwise `false`. This function
     * is a guard type that predicts validated data, see example below.
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
     *     // The “user” type is : { name: string; }
     * }
     * ```
     */
    guard(value) {
        const reject = (0, checker_1.checker)(this.criteria, value);
        return (!reject);
    }
    /**
     * @param value Data to be validated
     *
     * @returns `null` if value is compliant, otherwise `SchemaCheckReject`.
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
     *     console.log("The '" + reject.type + "' type was rejected with the following code : " + reject.code);
     * }
     * ```
     */
    check(value) {
        const reject = (0, checker_1.checker)(this.criteria, value);
        return (reject);
    }
}
exports.Schema = Schema;
