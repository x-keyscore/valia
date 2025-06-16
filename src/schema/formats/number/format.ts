import type { NumberSetableCriteria } from "./types";
import type { Format } from "../types";
import { isArray, isPlainObject } from "../../../testers";

export const NumberFormat: Format<NumberSetableCriteria> = {
	type: "number",
	mount(chunk, criteria) {
		Object.assign(criteria, {
			empty: criteria.empty ?? true
		});
	},
	check(chunk, criteria, value) {
		if (typeof value !== "number") {
			return ("TYPE.NUMBER.NOT_SATISFIED");
		}
		else if (value === 0) {
			return (criteria.empty ? null : "EMPTY.NOT_ALLOWED");
		}
		else if (criteria.min != null && value < criteria.min) {
			return ("MIN.NOT_SATISFIED");
		}
		else if (criteria.max != null && value > criteria.max) {
			return ("MAX.NOT_SATISFIED");
		}
		else if (criteria.enum != null) {
			if (isPlainObject(criteria.enum) && !Object.values(criteria.enum).includes(value)) {
				return ("ENUM.NOT_SATISFIED");
			} else if (isArray(criteria.enum) && !criteria.enum.includes(value)) {
				return ("ENUM.NOT_SATISFIED");
			}
		}
		else if (criteria.custom && !criteria.custom(value)) {
			return ("CUSTOM.NOT_SATISFIED");
		}

		return (null);
	}
}