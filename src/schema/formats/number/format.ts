import type { NumberSetableCriteria } from "./types";
import type { Format } from "../types";
import { isArray, isPlainObject } from "../../../testers";

export const NumberFormat: Format<NumberSetableCriteria> = {
	defaultCriteria: {},
	check(chunk, criteria, data) {
		if (typeof data !== "number") {
			return ("TYPE_NOT_NUMBER");
		}
		else if (criteria.min !== undefined && data < criteria.min) {
			return ("DATA_SUPERIOR_MIN");
		}
		else if (criteria.max !== undefined && data > criteria.max) {
			return ("DATA_SUPERIOR_MAX");
		}
		else if (criteria.enum !== undefined) {
			if (isPlainObject(criteria.enum) && !Object.values(criteria.enum).includes(data)) {
				return ("DATA_NOT_IN_ENUM");
			} else if (isArray(criteria.enum) && !criteria.enum.includes(data)) {
				return ("DATA_NOT_IN_ENUM");
			}
		}
		else if (criteria.custom && !criteria.custom(data)) {
			return ("TEST_CUSTOM_FAILED");
		}

		return (null);
	}
}