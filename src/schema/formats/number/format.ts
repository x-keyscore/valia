import type { NumberSetableCriteria } from "./types";
import type { Format } from "../types";
import { isArray, isPlainObject } from "../../../testers";

export const NumberFormat: Format<NumberSetableCriteria> = {
	type: "number",
	defaultCriteria: {},
	check(chunk, criteria, value) {
		if (typeof value !== "number") {
			return ("TYPE_NUMBER_REQUIRED");
		}
		else if (criteria.min != null && value < criteria.min) {
			return ("DATA_INFERIOR_MIN");
		}
		else if (criteria.max != null && value > criteria.max) {
			return ("DATA_SUPERIOR_MAX");
		}
		else if (criteria.enum != null) {
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