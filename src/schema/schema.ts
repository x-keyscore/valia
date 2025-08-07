import type { SetableCriteria, MountedCriteria, GuardedCriteria, FormatNativeTypes } from "./formats";
import type { SchemaEvaluateResult, SchemaInfer } from "./types";
import { EventsManager, FormatsManager } from "./managers";
import { cloner, mounter, checker } from "./services";
import { formatNatives } from "./formats";

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
			throw new Error("Criteria are not initialized.");
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
		const rejection = checker(this.managers, this.criteria, data);
		
		return (!rejection);
	}

	/**
	 * Evaluates the provided data against the schema.
	 *
	 * @param data - The data to be evaluated.
	 */
	evaluate(data: unknown): SchemaEvaluateResult<T> {
		const rejection = checker(this.managers, this.criteria, data);
		if (rejection) return ({ rejection, data: null });
		return ({ rejection: null, data });
	}
}

const sectionTitleSchema = new Schema({
	type: "object",
	shape: {
		type: { type: "string", literal: "title" },
		size: { type: "number", min: 1, max: 5 },
		title: { type: "string", max: 32 }
	}
});

const sectionTextSchema = new Schema({
	type: "object",
	shape: {
		type: { type: "string", literal: "text" },
		text: { type: "string" }
	}
});

const cardSchema = new Schema({
	type: "object",
	shape: {
		title: { type: "string", max: 128 },
		description: { type: "string", max: 2048 },
		is_public: { type: "boolean" },
		sections: {
			type: "array",
			items: {
				type: "union",
				union: [sectionTitleSchema.criteria, sectionTextSchema.criteria]
			}
		}
	}
});

const userSchema = new Schema({
	type: "object",
	shape: {
		email: {
			type: "string",
			constraint: {
				isEmail: true
			}
		},
		password: {
			type: "string",
			constraint: {
				isAscii: true
			}
		},
		cards: {
			type: "array",
			items: { type: "number" },
			tuple: [{ type: "string" }]
		}
	},
});

type User = SchemaInfer<typeof userSchema>;

/*
const function_variant_string = new Schema({
	type: "function",
	variant: "BASIC"
});
const xAsyncFunction = async function () {};
console.log(function_variant_string.validate(xAsyncFunction))*/
/*
function testf(): ("ASYNC" | "BASIC"  | undefined) {
	return ("" as ("ASYNC" | "BASIC" | undefined))
}

const test = new Schema({
	type: "string",
	literal: ["test"]
});

type Test = SchemaInfer<typeof test>;
*/
/*
const test = new Schema({
	type: "object",

	shape: {},
	expandable: true
});
console.log(test.evaluate(Array));

console.log(isObject(Array));*/
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