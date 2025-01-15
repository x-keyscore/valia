import type { VariantCriteria, FormatsGuard, MountedCriteria } from "../formats";
import type { SchemaCheckResult } from "./types";
/**
 * Represents the validation criteria structure and its associated functions.
 */
export declare class Schema<const DefinedCriteria extends VariantCriteria> {
    /**
     * Property used for schema reuse, see the example below.
     *
     * **Warning :** This property is not the same version
     * as the one passed as a constructor parameter.
     *
     * @example
     * ```ts
     * const userNameType = new Schema({ type: "string" });
     *
     * const userSchema = new Schema({
     *     type: "struct",
     *     struct: {
     *         name: userNameType.criteria
     *     }
     * });
     * ```
     */
    readonly criteria: MountedCriteria<DefinedCriteria>;
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
    constructor(criteria: DefinedCriteria);
    /**
     * @param value Data to be validated
     *
     * @returns `true` if value is compliant, otherwise `false`. For **Typescript** users,
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
    guard(value: unknown): value is FormatsGuard<DefinedCriteria>;
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
     *     console.log("The " + reject.type + " type was rejected with the following code : " + reject.code);
     * }
     * ```
     */
    check(value: unknown): SchemaCheckResult;
}
