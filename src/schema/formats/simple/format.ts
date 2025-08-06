import type { SimpleSetableCriteria, SimpleExceptionCodes, SimpleRejectionCodes } from "./types";
import type { Format } from "../types";

export const SimpleFormat: Format<
	SimpleSetableCriteria,
	SimpleExceptionCodes,
	SimpleRejectionCodes
> = {
	type: "simple",
	exceptions: {
		SIMPLE_PROPERTY_REQUIRED:
            "The 'simple' property must be defined.",
        SIMPLE_PROPERTY_MALFORMED:
            "The 'simple' property must be of type String.",
		SIMPLE_PROPERTY_STRING_MISCONFIGURED:
            "The 'simple' property must be a known string."
	},
	flags: ["NULLISH", "NULL", "UNDEFINED"],
	mount(chunk, criteria) {
		const { simple } = criteria;

		if (!("simple" in criteria)) {
			return ("NATURE_PROPERTY_REQUIRED");
		}
		if (typeof simple !== "string") {
			return ("NATURE_PROPERTY_MALFORMED");
		}
		if (!(simple in this.natureBitflags)) {
			return ("NATURE_PROPERTY_STRING_MISCONFIGURED");
		}

		Object.assign(criteria, {
			natureBitcode: this.natureBitflags[nature]
		});

		return (null);
	},
	check(chunk, criteria, value) {
		const { natureBitcode } = criteria, { natureBitflags } = this;
	
		if (natureBitcode & natureBitflags.UNKNOWN) {
			return (null);
		}
		if (natureBitcode & natureBitflags.NULLISH && value != null) {
			return ("NATURE_NULLISH_UNSATISFIED");
		}
		if (natureBitcode & natureBitflags.NULL && value !== null) {
			return ("NATURE_NULL_UNSATISFIED");
		}
		if ((natureBitcode & natureBitflags.UNDEFINED) && value !== undefined) {
			return ("NATURE_UNDEFINED_UNSATISFIED");
		}

		return (null);
	}
}