import type { BooleanSetableCriteria } from "./types";
import type { FormatTemplate } from "../types";

export const BooleanFormat: FormatTemplate<BooleanSetableCriteria> = {
	defaultCriteria: {},
	checking(queue, path, criteria, value) {
		if (typeof value !== "boolean") {
			return ("TYPE_NOT_BOOLEAN");
		}

		return (null);
	},
}
