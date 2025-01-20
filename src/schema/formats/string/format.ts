import type { StringVariantCriteria } from "./types";
import type { FormatTemplate } from "../types";
import { testers } from "../../..";

export const StringFormat: FormatTemplate<StringVariantCriteria> = {
	checkCriteria: {
		min: testers.primitive.isNumber,
		max: testers.primitive.isNumber,
		empty: testers.primitive.isBoolean,
		regex: testers.object.isRegex,
		tester: testers.object.isPlainObject,
		custom: testers.object.isPlainFunction
	},
	defaultCriteria: {
		empty: true
	},
	checking(queue, criteria, value) {
		if (typeof value !== "string") {
			return ("TYPE_NOT_STRING");
		}

		const valueLength = value.length;

		if (!valueLength) {
			return (criteria.empty ? null : "VALUE_EMPTY");
		}
		else if (criteria.min !== undefined && valueLength < criteria.min) {
			return ("VALUE_INFERIOR_MIN");
		}
		else if (criteria.max !== undefined && valueLength > criteria.max) {
			return ("VALUE_SUPERIOR_MAX");
		}
		else if (criteria.regex !== undefined && !criteria.regex.test(value)) {
			return ("VALUE_REGEX_FAILED");
		} else if (criteria.tester && !testers.string[criteria.tester.name](value, criteria.tester?.params as any)) {
			return ("VALUE_TESTER_FAILED");
		} else if (criteria.custom && !criteria.custom(value)) {
			return ("VALUE_CUSTOM_FAILED");
		}

		return (null);
	},
}