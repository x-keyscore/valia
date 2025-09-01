import type { UndefinedSetableCriteria, UndefinedRejectionCodes } from "./types";
import type { Format } from "../types";

export const UndefinedFormat: Format<
	UndefinedSetableCriteria,
	never,
	UndefinedRejectionCodes
> = {
	type: "undefined",
	exceptions: {},
	mount(chunk, criteria) {
		return (null);
	},
	check(chunk, criteria, value) {
		if (value !== undefined) {
			return ("TYPE_UNDEFINED_UNSATISFIED");
		}

		return (null);
	}
}
