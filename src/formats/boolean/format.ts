import type { BooleanVariantCriteria } from "./types";
import type { FormatTemplate } from "../types";
import { isBoolean } from "../../testers";

export const BooleanFormat: FormatTemplate<BooleanVariantCriteria> = {
	defaultCriteria: {},
	checking(queue, criteria, value) {
		if (!isBoolean(value)) {
			return ("TYPE_NOT_BOOLEAN");
		}

		return (null);
	},
}
