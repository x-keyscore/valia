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
		SIMPLE_PROPERTY_REQUIRED:
            "The 'simple' property must be defined.",
        SIMPLE_PROPERTY_MALFORMED:
            "The 'simple' property must be of type string.",
		SIMPLE_PROPERTY_STRING_MISCONFIGURED:
            "The 'simple' property must be a known string."
	},
	simples: ["NULL", "UNDEFINED", "NULLISH"],
	mount(chunk, criteria) {
		const { simple } = criteria;

		if (!("simple" in criteria)) {
			return ("SIMPLE_PROPERTY_REQUIRED");
		}
		if (typeof simple !== "string") {
			return ("SIMPLE_PROPERTY_MALFORMED");
		}
		if (!this.simples.includes(simple)) {
			return ("SIMPLE_PROPERTY_STRING_MISCONFIGURED");
		}

		return (null);
	},
	check(chunk, criteria, value) {
		const { simple } = criteria;

		if (simple === "NULLISH" && value != null) {
			return ("SIMPLE_NULLISH_UNSATISFIED");
		}
		if (simple === "NULL" && value !== null) {
			return ("SIMPLE_NULL_UNSATISFIED");
		}
		if (simple === "UNDEFINED" && value !== undefined) {
			return ("SIMPLE_UNDEFINED_UNSATISFIED");
		}

		return (null);
	}
}