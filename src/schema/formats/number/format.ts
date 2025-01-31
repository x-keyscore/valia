import type { NumberVariantCriteria } from "./types";
import type { FormatTemplate } from "../types";
import { isArray, isPlainObject } from "../../../testers";

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
		else if (criteria.enum !== undefined) {
			if (isPlainObject(criteria.enum) && !Object.values(criteria.enum).includes(value)) {
				return ("VALUE_NOT_IN_ENUM");
			} else if (isArray(criteria.enum) && !criteria.enum.includes(value)) {
				return ("VALUE_NOT_IN_ENUM");
			}
		}
		else if (criteria.custom && !criteria.custom(value)) {
			return ("TEST_CUSTOM_FAILED");
		}

		return (null);
	}
}