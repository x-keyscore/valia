import type { SetableCriteria, MountedCriteria, GuardedCriteria, FormatNativeNames } from "./formats";
import { EventsManager, FormatsManager } from "./managers";
import { cloner, mounter, checker } from "./services";
import { formatNatives } from "./formats";
import { Issue } from "../utils";

/**
 * The `Schema` class is used to define and validate data structures,
 * ensuring they conform to specified criteria.
 */
export class Schema<const T extends SetableCriteria = SetableCriteria<FormatNativeNames>> {
	private _criteria: MountedCriteria<T> | undefined;
	protected managers = {
		formats: new FormatsManager(),
		events: new EventsManager()
	}

	protected initiate(definedCriteria: T) {
		this.managers.formats.add(formatNatives);
		const clonedCriteria = cloner(definedCriteria);
		this._criteria = mounter(this.managers, clonedCriteria);
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
		if (!this._criteria) {
			throw new Issue("Schema", "Criteria are not initialized.");
		}
		return (this._criteria);
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
	validate(data: unknown): data is GuardedCriteria<T> {
		const reject = checker(this.managers, this.criteria, data);

		return (!reject);
	}

	/**
	 * Evaluates the provided data against the schema.
	 *
	 * @param data - The data to be evaluated.
	 * 
	 * @returns An object containing:
	 * - `{ reject: CheckingReject, value: null }` if the data is **rejected**.
	 * - `{ reject: null, value: GuardedCriteria<T> }` if the data is **accepted**.
	 */
	evaluate(data: unknown) {
		const reject = checker(this.managers, this.criteria, data);

		if (reject) return ({ reject });
		return ({ data: data as GuardedCriteria<T> });
	}
}