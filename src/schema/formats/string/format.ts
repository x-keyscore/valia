import type { StringSetableCriteria, SetableTesters } from "./types";
import type { Format } from "../types";
import { isArray, testers } from "../../../testers";

export const StringFormat: Format<StringSetableCriteria> = {
	type: "string",
	mount(chunk, criteria) {
		Object.assign(criteria, {
			empty: criteria.empty ?? true
		});
	},
	check(chunk, criteria, value) {
		if (typeof value !== "string") {
			return ("TYPE.STRING.NOT_SATISFIED");
		}

		const valueLength = value.length;

		if (!valueLength) {
			return (criteria.empty ? null : "EMPTY.NOT_ALLOWED");
		}
		else if (criteria.min != null && valueLength < criteria.min) {
			return ("MIN.LENGTH.NOT_SATISFIED");
		}
		else if (criteria.max != null && valueLength > criteria.max) {
			return ("MAX.LENGTH.NOT_SATISFIED");
		}
		else if (criteria.enum != null) {
			if (isArray(criteria.enum) && !criteria.enum.includes(value)) {
				return ("ENUM.NOT_SATISFIED");
			} else if (!Object.values(criteria.enum).includes(value)) {
				return ("ENUM.NOT_SATISFIED");
			}
		}
		else if (criteria.regex != null && !criteria.regex.test(value)) {
			return ("REGEX.NOT_SATISFIED");
		}
		else if (criteria.testers) {
			for (const key of Object.keys(criteria.testers) as (keyof SetableTesters)[]) {
				if (!(testers.string[key](value, criteria.testers[key] as any))) {
					return ("TESTER.NOT_SATISFIED");
				}
			}
		}
		else if (criteria.custom && !criteria.custom(value)) {
			return ("CUSTOM.NOT_SATISFIED");
		}

		return (null);
	}
}

//[TYPE].[RULE].[DETAIL?].[RAISON]

type RejectCode =
	| "STRING.TYPE.STRING.NOT_SATISFIED"
	| "STRING.EMPTY.NOT_ALLOWED"
	| "STRING.MIN.LENGTH.NOT_SATISFIED"
	| "STRING.MAX.LENGTH.NOT_SATISFIED"
	| "STRING.ENUM.NOT_SATISFIED"
	| "STRING.REGEX.NOT_SATISFIED"
	| "STRING.CUSTOM.NOT_SATISFIED"
	| "STRING.TESTER.NOT_SATISFIED";
