import type { NumberVariantCriteria } from "./types";
import type { FormatTemplate } from "../types";
import { formatDefaultCriteria } from "../formats";
import { isNumber } from "../../testers";

export const NumberFormat: FormatTemplate<NumberVariantCriteria> = {
	defaultCriteria: {},
	mountCriteria(definedCriteria, mountedCriteria) {
		return (Object.assign(mountedCriteria, formatDefaultCriteria, definedCriteria));
	},
	checkValue(criteria, value) {
		if (!isNumber(value)) {
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