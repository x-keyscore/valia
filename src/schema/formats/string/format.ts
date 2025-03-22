import type { StringSetableCriteria } from "./types";
import type { Format } from "../types";
import { isArray, isPlainObject, testers } from "../../../testers";

export const StringFormat: Format<StringSetableCriteria> = {
	defaultCriteria: {
		empty: true
	},
	check(chunk, criteria, data) {
		if (typeof data !== "string") {
			return ("TYPE_NOT_STRING");
		}

		const dataLength = data.length;

		if (!dataLength) {
			return (criteria.empty ? null : "DATA_EMPTY");
		}
		else if (criteria.min !== undefined && dataLength < criteria.min) {
			return ("DATA_INFERIOR_MIN");
		}
		else if (criteria.max !== undefined && dataLength > criteria.max) {
			return ("DATA_SUPERIOR_MAX");
		}
		else if (criteria.enum !== undefined) {
			if (isArray(criteria.enum) && !criteria.enum.includes(data)) {
				return ("DATA_NOT_IN_ENUM");
			} else if (isPlainObject(criteria.enum) && !Object.values(criteria.enum).includes(data)) {
				return ("DATA_NOT_IN_ENUM");
			}
		}
		else if (criteria.regex !== undefined && !criteria.regex.test(data)) {
			return ("TEST_REGEX_FAILED");
		} else if (criteria.tester && !testers.string[criteria.tester.name](data, criteria.tester?.params as any)) {
			return ("TEST_TESTER_FAILED");
		} else if (criteria.custom && !criteria.custom(data)) {
			return ("TEST_CUSTOM_FAILED");
		}

		return (null);
	}
}