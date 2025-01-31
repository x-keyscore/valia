import type { StringVariantCriteria } from "./types";
import type { FormatTemplate } from "../types";
import { isArray, isPlainFunction, isPlainObject, testers } from "../../../testers";
import { Err } from "../../../utils";

export const StringFormat: FormatTemplate<StringVariantCriteria> = {
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
		else if (criteria.enum !== undefined) {
			if (isPlainObject(criteria.enum) && !Object.values(criteria.enum).includes(value)) {
				return ("VALUE_NOT_IN_ENUM");
			} else if (isArray(criteria.enum) && !criteria.enum.includes(value)) {
				return ("VALUE_NOT_IN_ENUM");
			}
		}
		else if (criteria.regex !== undefined && !criteria.regex.test(value)) {
			return ("VALUE_REGEX_FAILED");
		} else if (criteria.tester && !testers.string[criteria.tester.name](value, criteria.tester?.params as any)) {
			return ("VALUE_TESTER_FAILED");
		} else if (criteria.custom && !criteria.custom(value)) {
			return ("VALUE_CUSTOM_FAILED");
		}

		return (null);
	}
}