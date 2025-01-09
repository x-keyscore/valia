import type { FormatsCriteria, FormatsGuard, MountedCriteria } from "../formats";
import type { SchemaCheckReject } from "./types";
import { schemaMounter } from "./mounter";
import { schemaChecker } from "./checker";

/**
 * Represents the validation criteria structure and its associated functions.
 */
export class Schema<DefinedCriteria extends FormatsCriteria> {
	/**
	 * Property used for schema reuse, see the example below.
	 * 
	 * **Warning :** This property is not the same version
	 * as the one passed as a constructor parameter.
	 * 
	 * @example
	 * ```ts
	 * const userName = new Schema({ type: "string" });
	 * 
	 * const userSchema = new Schema({ 
	 *     type: "struct",
	 *     struct: {
	 *         name:  userName.criteria
	 *     }
	 * });
	 * ```
	 */
	public readonly criteria: MountedCriteria<DefinedCriteria>;

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
	constructor(definedCriteria: DefinedCriteria) {
		const clonedCriteria = structuredClone(definedCriteria);
		const mountedCriteria = schemaMounter(clonedCriteria);
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
	guard(entry: unknown): entry is FormatsGuard<DefinedCriteria> {
		const error = schemaChecker(this.criteria, entry);
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
	check(entry: unknown): SchemaCheckReject | null {
		const error = schemaChecker(this.criteria, entry);
		return (error);
	}
}