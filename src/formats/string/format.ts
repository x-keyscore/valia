import type { StringVariantCriteria } from "./types";
import type { FormatTemplate } from "../types";
import { formatDefaultCriteria } from "../formats";
import { testers, isString } from "../../";

export const StringFormat: FormatTemplate<StringVariantCriteria> = {
	defaultCriteria: {
		empty: true
	},
	mountCriteria(definedCriteria, mountedCriteria) {
		return (Object.assign(mountedCriteria, formatDefaultCriteria, this.defaultCriteria, definedCriteria));
	},
	checkValue(criteria, value) {
		if (!isString(value)) {
			return ("TYPE_NOT_STRING");
		}
		else if (!value.length) {
			return (criteria.empty ? null : "VALUE_EMPTY");
		}
		else if (criteria.min !== undefined && value.length < criteria.min) {
			return ("VALUE_INFERIOR_MIN");
		}
		else if (criteria.max !== undefined && value.length > criteria.max) {
			return ("VALUE_SUPERIOR_MAX");
		}
		else if (criteria.regex !== undefined && !criteria.regex.test(value)) {
			return ("VALUE_REGEX_FAILED");
		} else if (criteria.tester && !testers.string[criteria.tester.name](value, criteria.tester?.params as any)) {
			return ("VALUE_TESTER_FAILED");
		} else if (criteria.custom && !criteria.custom(value)) {
			return ("VALUE_CUSTOM_FAILED");
		}

		return null;
	}
}