import type { BooleanSetableCriteria, BooleanExceptionCodes, BooleanRejectionCodes } from "./types";
import type { Format } from "../types";

export const BooleanFormat: Format<
	BooleanSetableCriteria,
	BooleanExceptionCodes,
	BooleanRejectionCodes
> = {
	type: "boolean",
	exceptions: {
		LITERAL_PROPERTY_MISDECLARED:
			"The 'literal' property must be of type boolean."
	},
	mount(chunk, criteria) {
		const { literal } = criteria;

		if (literal !== undefined && typeof literal !== "boolean") {
			return ("LITERAL_PROPERTY_MISDECLARED");
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
	}
}
