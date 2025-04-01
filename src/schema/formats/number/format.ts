import type { NumberSetableCriteria } from "./types";
import type { Format } from "../types";
import { isArray, isPlainObject } from "../../../testers";

export const NumberFormat: Format<NumberSetableCriteria> = {
	defaultCriteria: {},
	check(chunk, criteria, value) {
		if (typeof value !== "number") {
			return ("TYPE_NUMBER_REQUIRED");
		}
		else if (criteria.min !== undefined && value < criteria.min) {
			return ("DATA_INFERIOR_MIN");
		}
		else if (criteria.max !== undefined && value > criteria.max) {
			return ("DATA_SUPERIOR_MAX");
		}
		else if (criteria.enum !== undefined) {
			if (isPlainObject(criteria.enum) && !Object.values(criteria.enum).includes(value)) {
				return ("DATA_ENUM_MISMATCH");
			} else if (isArray(criteria.enum) && !criteria.enum.includes(value)) {
				return ("DATA_ENUM_MISMATCH");
			}
		}
		else if (criteria.custom && !criteria.custom(value)) {
			return ("TEST_CUSTOM_FAILED");
		}

		return (null);
	}
}