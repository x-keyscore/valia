import type { BooleanVariantCriteria } from "./types";
import type { FormatTemplate } from "../types";

export const BooleanFormat: FormatTemplate<BooleanVariantCriteria> = {
	defaultCriteria: {},
	checking(queue, criteria, value) {
		if (typeof value !== "boolean") {
			return ("TYPE_NOT_BOOLEAN");
		}

		return (null);
	},
}
