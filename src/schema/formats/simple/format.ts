import type { SimpleSetableCriteria, SimpleErrorCodes, SimpleRejectCodes, SimpleCustomMembers } from "./types";
import type { Format } from "../types";

export const SimpleFormat: Format<
	SimpleSetableCriteria,
	SimpleErrorCodes,
	SimpleRejectCodes,
	SimpleCustomMembers
> = {
	type: "simple",
	errors: {
		SIMPLE_PROPERTY_REQUIRED:
            "The 'simple' property must be defined.",
        SIMPLE_PROPERTY_MALFORMED:
            "The 'simple' property must be of type String.",
		SIMPLE_PROPERTY_STRING_MISCONFIGURED:
            "The 'simple' property must be a known string."
	},
	bitflags: {
		UNKNOWN:	1 << 0,
		NULLISH:	1 << 1,
		NULL:		1 << 2,
		UNDEFINED:	1 << 3
	},
	mount(chunk, criteria) {
		const { simple } = criteria;

		if (!("simple" in criteria)) {
			return ("SIMPLE_PROPERTY_REQUIRED");
		}
		if (typeof simple !== "string") {
			return ("SIMPLE_PROPERTY_MALFORMED");
		}
		if (!(simple in this.bitflags)) {
			return ("SIMPLE_PROPERTY_STRING_MISCONFIGURED");
		}

		Object.assign(criteria, {
			bitcode: this.bitflags[simple]
		});

		return (null);
	},
	check(chunk, criteria, value) {
		const { bitcode } = criteria, { bitflags } = this;
	
		if (bitcode & bitflags.UNKNOWN) {
			return (null);
		}
		if (bitcode & bitflags.NULLISH && value != null) {
			return ("SIMPLE_NULLISH_UNSATISFIED");
		}
		if (bitcode & bitflags.NULL && value !== null) {
			return ("SIMPLE_NULL_UNSATISFIED");
		}
		if ((bitcode & bitflags.UNDEFINED) && value !== undefined) {
			return ("SIMPLE_UNDEFINED_UNSATISFIED");
		}

		return (null);
	}
}