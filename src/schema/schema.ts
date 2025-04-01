import type { SetableCriteria, MountedCriteria, GuardedCriteria, FormatNatives } from "./formats";
import { EventsManager, FormatsManager } from "./managers";
import { cloner, mounter, checker } from "./services";
import { formatNatives } from "./formats";
import { Issue } from "../utils";
import { SchemaInfer } from "./types";

/**
 * Represents a schema for data validation, including the validation criteria structure.
 */
export class Schema<const T extends SetableCriteria = SetableCriteria<keyof FormatNatives>> {
	private _criteria: MountedCriteria<T> | undefined;
	protected managers = {
		formats: new FormatsManager(),
		events: new EventsManager()
	}

	protected initiate(definedCriteria: T) {
		this.managers.formats.set(formatNatives);
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
	 * - `{ reject: SchemaReject, value: null }` if the data is **invalid**.
	 * - `{ reject: null, value: GuardedCriteria<T> }` if the data is **valid**.
	 */
	evaluate(data: unknown) {
		const reject = checker(this.managers, this.criteria, data);

		if (reject) return ({ reject, data: null });
		return ({ reject: null, data: data as GuardedCriteria<T> });
	}
}

const test = new Schema({
	type: "struct",
	struct: {
		foo: { type: "atomic", atomic: "any" }
	}
});

type test = SchemaInfer<typeof test>;

/*
const schema = new Schema({
	type: "struct",
	label: "root",
	struct: {
		branch_1: {
			type: "struct",
			label: "branch_1",
			struct: {
				element: {
					type: "struct",
					label: "struct_b1",
					struct: {
						element: {
							type: "struct",
							label: "struct_b1",
							struct: {
								element: {
									type: "string",
									label: "string_b1"
								}	
							}
						}
					}
				}
			}
		},
		branch_2: {
			type: "struct",
			label: "branch_2",
			struct: {
				element: {
					type: "struct",
					label: "struct_b2",
					struct: {
						element: {
							type: "struct",
							label: "struct_b2",
							struct: {
								element: {
									type: "string",
									label: "string_b2"
								}	
							}
						}
					}
				}
			}
		},
		branch_3: {
			type: "struct",
			label: "branch_3",
			struct: {
				element: {
					type: "struct",
					label: "struct_b3",
					struct: {
						element: {
							type: "struct",
							label: "struct_b3",
							struct: {
								element: {
									type: "string",
									label: "string_b3"
								}	
							}
						}
					}
				}
			}
		}
	}
});

schema.validate({
	branch_1: {
		element: {
			element: {
				element: "string_b1"
			} 
		}
	},
	branch_2: {
		element: {
			element: {
				element: "string_b2"
			} 
		}
	},
	branch_3: {
		element: {
			element: {
				element: "string_b3"
			} 
		}
	},
})
*/
/*
const test = new Schema({
	type: "union",
	union: [{
		type: "struct",
		struct: {
			foo: { type: "string" },
			bar: {
				type: "struct",
				struct: {
					foobar: {
						foo: { type: "string" },
						bar: {
							type: "struct",
							struct: {
								foobar: { type: "string" }
							}
						}
					}
				}
			}
		}
	}, {
		type: "struct",
		struct: {
			foo: {
				type: "struct",
				struct: {
					foobar: { type: "string" }
				}
			},
			bar: { type: "string" }
		}
	}]
});

console.log(test.evaluate({
	foo: "x",
	bar: {
		foobar: {
			foo: "x",
			bar: {
				foobar: "x"
			}
		}
	}
}))*/
/*
const schema_union = new Schema({
	type: "struct",
	struct: {
		foo: {
			type: "union",
			union: [
				{
					type: "struct",
					struct: {
						foo: {
							type: "union",
							union: [{
								type: "struct",
								struct: {
									foo: { type: "number" },
									bar: { type: "string" }
								}
							}, {
								type: "string"
							}]
						},
						bar: { type: "string" }
					}
				},
				{
					type: "struct",
					struct: {
						foo: { type: "string" }, 
						bar: {
							type: "union",
							union: [{
								type: "struct",
								struct: {
									foo: { type: "string" },
									bar: { type: "number" }
								}
							}, {
								type: "string"
							}]
						}
					}
				}
			]
		}
	}
});

type schem = SchemaInfer<typeof schema_union>


const ddata: unknown = { foo: { foo: { foo: "x", bar: "x" }, bar: "x" }};
if (schema_union.validate(ddata)) {
	if (typeof ddata.foo.foo !== "string") ddata.foo.foo.bar
	
	
}	
console.log();*/