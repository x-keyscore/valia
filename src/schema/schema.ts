import type { SetableCriteria, MountedCriteria, GuardedCriteria, FormatNativeTypes } from "./formats";
import type { SchemaEvaluate, SchemaInfer } from "./types";
import { EventsManager, FormatsManager } from "./managers";
import { cloner, mounter, checker } from "./services";
import { formatNatives } from "./formats";
import { Issue } from "../utils";

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

/*
const test = new Schema({
	type: "object",
	strict: false,
	static: {
		optional: ["foo"],
		min: 0,
		max: 0,
		shape: {
			foo: { type: "string" }
		}
	},
	dynamic: {
		empty: true,
		min: 0,
		max: 0,
		key: { type: "string" },
		value: { type: "string" }
	}
});

const test = new Schema({
	type: "object",
	strict: false,
	shape: {
		foo: { type: "string" }
	},
	optional: ["foo"],
	additional: {
		min: 0,
		max: 0,
		key: { type: "string" },
		value: { type: "string" }
	}
});
*/

function testdd(): (MountedCriteria<SetableCriteria<"string" | "symbol">>) {
	return {} as any;
}

const test = new Schema({
	type: "object",
	shape: {
		foo: {
			type: "string"
		},
		bar: {
			type: "number"
		}
	},
	omittable: true,
	expandable: {
		key: { type: "string" },
		value: { type: "symbol" }
	}
});


type Test = SchemaInfer<typeof test>;

//type Debug = Test['additional']
// Fetcher

// const struct_additional_true = new Schema({ type: 'number', enum: { one: 1, two: 2, three: 3 } });

//struct_additional_true.validate({ foo: "", bar: 1, baz: 2 })
/*
const struct_optional_true = new Schema({
	type: "struct",
	optional: true,
	struct: {
		foo: { type: "string" },
		bar: { type: "number" }
	}
});

console.log(struct_optional_true.validate({ bar: 0 }));*/