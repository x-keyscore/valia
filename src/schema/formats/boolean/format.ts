import type { BooleanSetableCriteria, BooleanRejects } from "./types";
import type { Format } from "../types";

export const BooleanFormat: Format<BooleanSetableCriteria, never, BooleanRejects> = {
	type: "boolean",
	errors: {},
	check(chunk, criteria, value) {
		if (typeof value !== "boolean") {
			return ("TYPE_BOOLEAN_UNSATISFIED");
		}

		return (null);
	},
}
