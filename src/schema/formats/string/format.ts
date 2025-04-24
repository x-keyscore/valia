import type { StringSetableCriteria } from "./types";
import type { Format } from "../types";
import { isArray, isPlainObject, testers } from "../../../testers";

export const StringFormat: Format<StringSetableCriteria> = {
	type: "string",
	defaultCriteria: {
		empty: true
	},
	check(chunk, criteria, data) {
		if (typeof data !== "string") {
			return ("TYPE_STRING_REQUIRED");
		}

		const dataLength = data.length;

		if (!dataLength) {
			return (criteria.empty ? null : "DATA_EMPTY");
		}
		else if (criteria.min != null && dataLength < criteria.min) {
			return ("DATA_LENGTH_INFERIOR_MIN");
		}
		else if (criteria.max != null && dataLength > criteria.max) {
			return ("DATA_LENGTH_SUPERIOR_MAX");
		}
		else if (criteria.enum != null) {
			if (isArray(criteria.enum) && !criteria.enum.includes(data)) {
				return ("DATA_ENUM_MISMATCH");
			} else if (isPlainObject(criteria.enum) && !Object.values(criteria.enum).includes(data)) {
				return ("DATA_ENUM_MISMATCH");
			}
		}
		else if (criteria.regex != null && !criteria.regex.test(data)) {
			return ("TEST_REGEX_FAILED");
		} else if (criteria.tester && !testers.string[criteria.tester.name](data, criteria.tester?.params as any)) {
			return ("TEST_TESTER_FAILED");
		} else if (criteria.custom && !criteria.custom(data)) {
			return ("TEST_CUSTOM_FAILED");
		}

		return (null);
	}
}