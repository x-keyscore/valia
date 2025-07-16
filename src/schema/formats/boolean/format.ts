import type { BooleanSetableCriteria, BooleanErrorCodes, BooleanRejectCodes } from "./types";
import type { Format } from "../types";

export const BooleanFormat: Format<BooleanSetableCriteria, BooleanErrorCodes, BooleanRejectCodes> = {
	type: "boolean",
	errors: {
		LITERAL_PROPERTY_MALFORMED:
			"The 'literal' property must be of type Boolean."
	},
	mount(chunk, criteria) {
		const { literal } = criteria;

		if (literal !== undefined && typeof literal !== "boolean") {
			return ("LITERAL_PROPERTY_MALFORMED");
		}

		return (null);
	},
	check(chunk, criteria, value) {
		if (typeof value !== "boolean") {
			return ("TYPE_BOOLEAN_UNSATISFIED");
		}

		const { literal } = criteria;

		if (literal !== undefined && literal !== value) {
			return ("LITERAL_UNSATISFIED");
		}

		return (null);
	},
}
