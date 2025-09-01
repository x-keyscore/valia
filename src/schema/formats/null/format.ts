import type { NullSetableCriteria, NullRejectionCodes } from "./types";
import type { Format } from "../types";

export const NullFormat: Format<
	NullSetableCriteria,
	never,
	NullRejectionCodes
> = {
	type: "null",
	exceptions: {},
	mount(chunk, criteria) {
		return (null);
	},
	check(chunk, criteria, value) {
		if (value !== null) {
			return ("TYPE_NULL_UNSATISFIED");
		}

		return (null);
	}
}
