import type { SimpleSetableCriteria, SimpleExceptionCodes, SimpleRejectionCodes, SimpleCustomMembers } from "./types";
import type { Format } from "../types";

export const SimpleFormat: Format<
	SimpleSetableCriteria,
	SimpleExceptionCodes,
	SimpleRejectionCodes,
	SimpleCustomMembers
> = {
	type: "simple",
	exceptions: {
		NATURE_PROPERTY_REQUIRED:
            "The 'nature' property must be defined.",
        NATURE_PROPERTY_MALFORMED:
            "The 'nature' property must be of type String.",
		NATURE_PROPERTY_STRING_MISCONFIGURED:
            "The 'nature' property must be a known string."
	},
	natureBitflags: {
		UNKNOWN:	1 << 0,
		NULLISH:	1 << 1,
		NULL:		1 << 2,
		UNDEFINED:	1 << 3
	},
	mount(chunk, criteria) {
		const { nature } = criteria;

		if (!("nature" in criteria)) {
			return ("NATURE_PROPERTY_REQUIRED");
		}
		if (typeof nature !== "string") {
			return ("NATURE_PROPERTY_MALFORMED");
		}
		if (!(nature in this.natureBitflags)) {
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