import type { BooleanSetableCriteria } from "./types";
import type { Format } from "../types";

export const BooleanFormat: Format<BooleanSetableCriteria> = {
	defaultCriteria: {},
	check(chunk, criteria, data) {
		if (typeof data !== "boolean") {
			return ("TYPE_BOOLEAN_REQUIRED");
		}

		return (null);
	},
}
