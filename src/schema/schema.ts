import type { SetableCriteria, MountedCriteria, GuardedCriteria, NativeFormats } from "./formats";
import { registryManager, eventsManager, formatsManager } from "./managers";
import { mounter, checker, cloner } from "./services";
import { nativeFormats } from "./formats";
import { Issue } from "../utils";

/**
 * Represents a schema for data validation, including the validation criteria structure.
 */
export class Schema<const T extends SetableCriteria = SetableCriteria<keyof NativeFormats>> {
	private mountedCriteria: MountedCriteria<T> | undefined;
	protected managers = {
		registry: registryManager(),
		formats: formatsManager(),
		events: eventsManager()
	}

	protected initiate(definedCriteria: T) {
		this.managers.formats.set(nativeFormats);

		const clonedCriteria = cloner(definedCriteria);
		this.mountedCriteria = mounter(this.managers, clonedCriteria);
	}

	constructor(criteria: T) {
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
	get criteria(): MountedCriteria<T> {
		if (!this.mountedCriteria) {
			throw new Issue("Schema", "Criteria are not initialized.");
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
		const reject = checker(this.managers, this.criteria, value);
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
		const reject = checker(this.managers, this.criteria, value);
		if (reject) {
			return ({ reject, value: null });
		}
		return ({ reject: null, value }) as { reject: null, value: GuardedCriteria<T> };
	}
}