import type { SetableCriteria, MountedCriteria, GuardedCriteria, FormatNativeNames } from "./formats";
import { EventsManager, FormatsManager } from "./managers";
import { cloner, mounter, checker } from "./services";
import { formatNatives } from "./formats";
import { Issue } from "../utils";
import { SchemaInfer } from "./types";

/**
 * The `Schema` class is used to define and validate data structures,
 * ensuring they conform to specified criteria.
 */
export class Schema<const T extends SetableCriteria = SetableCriteria<FormatNativeNames>> {
	private mountedCriteria: MountedCriteria<T> | undefined;

	protected managers = {
		formats: new FormatsManager(),
		events: new EventsManager()
	}

	protected initiate(criteria: T) {
		this.managers.formats.add(formatNatives);
		const clonedCriteria = cloner(criteria);
		this.mountedCriteria = mounter(this.managers, clonedCriteria);
	}

	constructor(criteria: T) {
		// Deferred initiation of criteria if not called directly,
		// as plugins (or custom extensions) may set up specific
		// rules and actions for the preparation of the criteria.
		if (new.target === Schema) this.initiate(criteria);
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
	 * @param data - The data to be validated.
	 * 
	 * @returns `true` if the value is **valid**, otherwise `false`.  
	 * This function acts as a **type guard**, ensuring that
	 * the validated data conforms to `GuardedCriteria<T>`.
	 */
	validate(data: unknown): data is GuardedCriteria<MountedCriteria<T>> {
		const reject = checker(this.managers, this.criteria, data);

		return (!reject);
	}

	/**
	 * Evaluates the provided data against the schema.
	 *
	 * @param data - The data to be evaluated.
	 * 
	 * @returns An object containing:
	 * - `{ reject: CheckingReject }` if the data is **rejected**.
	 * - `{ data: GuardedCriteria<T> }` if the data is **accepted**.
	 */
	evaluate(data: unknown) {
		const reject = checker(this.managers, this.criteria, data);

		if (reject) return ({ reject });
		return ({ data: data as GuardedCriteria<T> });
	}
}