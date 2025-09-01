import type { SetableCriteria, MountedCriteria, GuardedCriteria, FormatNativeTypes } from "./formats";
import type { SchemaEvaluateResult } from "./types";
import { EventsManager, FormatsManager } from "./managers";
import { cloner, mounter, checker } from "./services";
import { SchemaException } from "./utils";
import { formatNatives } from "./formats";
import { isPlainObject } from "../testers";

/**
 * The `Schema` class is used to define and validate data structures, ensuring they conform to criteria node.
 */
export class Schema<const T extends SetableCriteria = SetableCriteria<FormatNativeTypes>> {
	private mountedCriteria: MountedCriteria<T> | undefined;

	protected managers = {
		formats: new FormatsManager(),
		events: new EventsManager()
	}

	protected initiate(criteria: T) {
		if (!isPlainObject(criteria)) {
			throw new SchemaException(
				"The 'criteria' parameter must be of type plain object."
			);
		}

		this.managers.formats.add(formatNatives);
		this.mountedCriteria = mounter(this.managers, cloner(criteria));
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
			throw new SchemaException(
				"The 'mountedCriteria' class property is not initialized."
			);
		}
		return (this.mountedCriteria);
	}

	/**
	 * Validates the provided data against the schema.
	 * 
	 * @param data - The data to be validated.
	 * 
	 * @returns A boolean.
	 */
	validate(data: unknown): data is GuardedCriteria<MountedCriteria<T>> {
		return (checker(this.managers, this.criteria, data).success);
	}

	/**
	 * Evaluates the provided data against the schema.
	 *
	 * @param data - The data to be evaluated.
	 */
	evaluate(data: unknown): SchemaEvaluateResult<GuardedCriteria<MountedCriteria<T>>> {
		return (checker(this.managers, this.criteria, data));
	}

	public listener = {
		on: this.managers.events.on,
		off: this.managers.events.off
	}
}

const objectSchema = new Schema({
	type: "object",
	shape: {
		foo: { type: "string" }
	},
	values: {
		type: "array",
		tuple: [{ type: "string" }]
	}
});
