import type { NumberVariantCriteria } from "./types";
import type { FormatTemplate } from "../types";
import { isNumber } from "../../../testers";

export const NumberFormat: FormatTemplate<NumberVariantCriteria> = {
	defaultCriteria: {},
	checking(queue, criteria, value) {
		if (typeof value !== "number") {
			return ("TYPE_NOT_NUMBER");
		}
		else if (criteria.min !== undefined && value < criteria.min) {
			return ("VALUE_SUPERIOR_MIN");
		}
		else if (criteria.max !== undefined && value > criteria.max) {
			return ("VALUE_SUPERIOR_MAX");
		}
		else if (criteria.custom && !criteria.custom(value)) {
			return ("TEST_CUSTOM_FAILED");
		}

		return (null);
	}
}