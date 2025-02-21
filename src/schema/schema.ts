import type { SetableCriteria, MountedCriteria, GuardedCriteria } from "./formats";
import { registryManager, eventsManager } from "./managers";
import { mounter, checker, cloner } from "./services";
import { Issue } from "../utils";

/**
 * Represents a schema for data validation, including the validation criteria structure.
 */
export class Schema<const T extends SetableCriteria> {
	protected mountedCriteria: MountedCriteria<T> | undefined;
	protected registryManager = registryManager.call(this);
	protected eventsManager = eventsManager.call(this);

	protected mountCriteria(definedCriteria: T) {
		const clonedCriteria = cloner(definedCriteria);

		this.mountedCriteria = mounter(
			this.registryManager,
			this.eventsManager,
			clonedCriteria
		);
	}

	constructor(criteria: T) {
		// Deferred preparation of criteria if not called directly,
		// as plugins (or custom extensions) may set up specific
		// rules and actions for the preparation of the criteria.
		if (new.target.name === "Schema") {
			this.mountCriteria(criteria);
		}
	}

	/**
	 * Properties representing the root of the mounted criteria,
	 * which can be used in other schemas.
	 */
	get criteria(): MountedCriteria<T> {
		if (!this.mountedCriteria) {
			throw new Issue(
				"Schema",
				"The criteria have not been mounted."
			);
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
	validate(value: unknown): value is GuardedCriteria<T> {
		const reject = checker(this.registryManager, this.criteria, value);
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
	evaluate(value: unknown) {
		const reject = checker(this.registryManager, this.criteria, value);
		if (reject) {
			return ({ reject, value: null });
		}
		return ({ reject: null, value }) as { reject: null, value: GuardedCriteria<T> };
	}
}