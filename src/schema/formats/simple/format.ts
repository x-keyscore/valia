import type { SimpleSetableCriteria, SimpleErrors, SimpleRejects, SimpleMembers } from "./types";
import type { Format } from "../types";

export const SimpleFormat: Format<SimpleSetableCriteria, SimpleErrors, SimpleRejects, SimpleMembers> = {
	type: "simple",
	errors: {
		SIMPLE_PROPERTY_REQUIRED:
            "The 'simple' property must be defined.",
        SIMPLE_PROPERTY_MALFORMED:
            "The 'simple' property must be of type String.",
		SIMPLE_PROPERTY_STRING_MISCONFIGURED:
            "The 'simple' property must be a recognized string."
	},
	bitflags: {
		null:			1 << 0,
		undefined:		1 << 1,
		nullish:		1 << 2,
		unknown:		1 << 3
	},
	mount(chunk, criteria) {
		const { simple } = criteria;

		if (!("simple" in criteria)) {
			return ("SIMPLE_PROPERTY_REQUIRED");
		}
		if (typeof simple !== "string") {
			return ("SIMPLE_PROPERTY_MALFORMED");
		}

		const bitcode = this.bitflags[simple];
		if (bitcode === undefined) {
			return ("SIMPLE_PROPERTY_STRING_MISCONFIGURED");
		}

		Object.assign(criteria, { bitcode });

		return (null);
	},
	check(chunk, criteria, value) {
		const { bitcode } = criteria;
		const { bitflags } = this;
	
		if (bitcode & bitflags.unknown) {
			return (null);
		}
		if (bitcode & bitflags.nullish && value != null) {
			return ("SIMPLE_NULLISH_UNSATISFIED");
		}
		if (bitcode & bitflags.null && value !== null) {
			return ("SIMPLE_NULL_UNSATISFIED");
		}
		if ((bitcode & bitflags.undefined) && value !== undefined) {
			return ("SIMPLE_UNDEFINED_UNSATISFIED");
		}

		return (null);
	}
}