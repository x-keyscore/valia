/*
import type { ArraySetableCriteria, ArrayErrors, ArrayRejects } from "./types";
import type { Format } from "../types";
import { isPlainObject, isArray } from "../../../testers";

export const ArrayFormat: Format<ArraySetableCriteria, ArrayErrors, ArrayRejects> = {
	type: "array",
	errors: {
		ITEM_PROPERTY_REQUIRED:
			"The 'item' property key is required.",
		ITEM_PROPERTY_MALFORMED:
		    "The 'item' property must be of type Plain Object.",
        EMPTY_PROPERTY_MALFORMED:
            "The 'empty' property must be of type Boolean.",
        MIN_PROPERTY_MALFORMED:
            "The 'min' property must be of type Number.",
        MAX_PROPERTY_MALFORMED:
            "The 'max' property must be of type Number.",
        MIN_AND_MAX_PROPERTIES_MISCONFIGURED:
            "The 'min' property cannot be greater than 'max' property."
	},
	mount(chunk, criteria) {
		const { empty, min, max } = criteria;

		if (criteria.item !== undefined && !isPlainObject(criteria.item)) {
			return ("ITEM_PROPERTY_MALFORMED");
		}
		if (empty !== undefined && typeof empty !== "boolean") {
			return ("EMPTY_PROPERTY_MALFORMED");
		}
		if (min !== undefined && typeof min !== "number") {
			return ("MIN_PROPERTY_MALFORMED");
		}
		if (max !== undefined && typeof max !== "number") {
			return ("MAX_PROPERTY_MALFORMED");
		}
		if (min !== undefined && max !== undefined && min > max) {
			return ("MIN_AND_MAX_PROPERTIES_MISCONFIGURED");
		}

		Object.assign(criteria, { 
			empty: empty ?? true
		});

		if (criteria.item) {
			chunk.push({
				node: criteria.item,
				partPaths: {
					explicit: ["item"],
					implicit: ["%", "number"],
				}
			});
		}

		return (null);
	},
	check(chunk, criteria, data) {
		if (!isArray(data)) {
			return ("TYPE_ARRAY_UNSATISFIED");
		}

		const { empty, min, max } = criteria;
		const dataLength = data.length;
	
		if (!dataLength) {
			return (empty ? null : "EMPTY_UNALLOWED");
		}
		if (min !== undefined && dataLength < min) {
			return ("MIN_UNSATISFIED");
		}
		if (max !== undefined && dataLength > max) {
			return ("MAX_UNSATISFIED");
		}

		if (criteria.item) {
			for (let i = 0; i < dataLength; i++) {
				chunk.push({
					data: data[i],
					node: criteria.item
				});
			}
		}

		return (null);
	}
};
*/