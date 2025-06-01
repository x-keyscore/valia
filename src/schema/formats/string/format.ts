import type { StringSetableCriteria, SetableTests } from "./types";
import type { Format } from "../types";
import { isArray, testers } from "../../../testers";

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
			} else if (!Object.values(criteria.enum).includes(data)) {
				return ("DATA_ENUM_MISMATCH");
			}
		}

		if (criteria.tests) {
			for (const key of Object.keys(criteria.tests) as (keyof SetableTests)[]) {
				if (!(testers.string[key](data, criteria.tests[key] as any))) {
					return ("TEST_STRING_FAILED");
				}
			}
		}

		if (criteria.regex != null && !criteria.regex.test(data)) {
			return ("TEST_REGEX_FAILED");
		}
		else if (criteria.custom && !criteria.custom(data)) {
			return ("TEST_CUSTOM_FAILED");
		}

		return (null);
	}
}