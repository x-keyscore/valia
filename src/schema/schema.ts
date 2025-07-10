import type { SetableCriteria, MountedCriteria, GuardedCriteria, FormatNativeTypes } from "./formats";
import type { SchemaEvaluate, SchemaInfer } from "./types";
import { EventsManager, FormatsManager } from "./managers";
import { cloner, mounter, checker } from "./services";
import { formatNatives } from "./formats";
import { Issue } from "../utils";
import { isObject } from "../testers";

/**
 * The `Schema` class is used to define and validate data structures,
 * ensuring they conform to specified criteria.
 */
export class Schema<const T extends SetableCriteria = SetableCriteria<FormatNativeTypes>> {
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
			throw new Issue("SCHEMA", "Criteria are not initialized.");
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
	 */
	evaluate(data: unknown): SchemaEvaluate<T> {
		const reject = checker(this.managers, this.criteria, data);
		if (reject) return ({ reject, data: null });

		return ({ reject: null, data });
	}
}

const test = new Schema({
	type: "object",
	is: "like" | "basic" | "plain", 
	shape: {},
	expandable: true
});
console.log(test.evaluate(Array));



console.log(isObject(Array));
/*
const hslItem = new Schema({
	type: "object",
	shape: {
		h: { type: "number" },
		s: { type: "number" },
		l: { type: "number" }
	}
});

const test = new Schema({
	type: "array",
	shape: [],
	expandable: {
		max: 10,
		item: hslItem.criteria
	}
});

type Test = SchemaInfer<typeof test>;

console.log(test.evaluate([{ h: 10, s: 10, l: 20 }]));
*/


//type Debug = Test['additional']
/*
const union_object = new Schema({
	type: "union",
	union: [{
		type: "object",
		shape: {
			foo: { type: "string" },
			bar: {
				type: "object",
				shape: {
					foo: {
						foo: {
							type: "object",
							shape: {
								foo: { type: "string" }
							}
						},
						bar: { type: "string" }
					}
				}
			}
		}
	}, {
		type: "object",
		shape: {
			foo: {
				type: "object",
				shape: {
					foo: {
						type: "object",
						shape: {
							foo: { type: "string" },
							bar: {
								type: "object",
								shape: {
									foo: { type: "string" }
								}
							}
						}
					}
				}
			},
			bar: { type: "string" }
		}
	}]
});
*/