import type { NumberSetableCriteria, NumberErrors, NumberRejects } from "./types";
import type { Format } from "../types";
import { isPlainObject, isArray, isFunction } from "../../../testers";

export const NumberFormat: Format<NumberSetableCriteria, NumberErrors, NumberRejects> = {
	type: "number",
	errors: {
        MIN_PROPERTY_MALFORMED:
		    "The 'min' property must be of type Number.",
       	MAX_PROPERTY_MALFORMED:
            "The 'max' property must be of type Number.",
        MIN_AND_MAX_PROPERTIES_MISCONFIGURED:
			"The 'min' property cannot be greater than 'max' property.",
        ENUM_PROPERTY_MALFORMED:
            "The 'enum' property must be of type Array or Plain Object.",
        ENUM_PROPERTY_ARRAY_ITEM_MALFORMED:
			"The array items of the 'enum' property must be of type Number.",
		ENUM_PROPERTY_OBJECT_KEY_MALFORMED:
			"The object keys of the 'enum' property must be of type String.",
        ENUM_PROPERTY_OBJECT_VALUE_MALFORMED:
			"The object values of the 'enum' property must be of type Number.",
        CUSTOM_PROPERTY_MALFORMED:
            "The 'custom' property must be of type Basic Function."
    },
	mount(chunk, criteria) {
		const { min, max, custom } = criteria;

		if (min !== undefined && typeof min !== "number") {
			return ("MIN_PROPERTY_MALFORMED");
		}
		if (max !== undefined && typeof max !== "number") {
			return ("MAX_PROPERTY_MALFORMED");
		}
		if (min !== undefined && max !== undefined && min > max) {
			return ("MIN_AND_MAX_PROPERTIES_MISCONFIGURED");
		}
		if (criteria.enum !== undefined) {
			if (isArray(criteria.enum)) {
				for (const item of criteria.enum) {
					if (typeof item !== "number") {
						return ("ENUM_PROPERTY_ARRAY_ITEM_MALFORMED");
					}
				}
			} else if (isPlainObject(criteria.enum)) {
				for (const key of Reflect.ownKeys(criteria.enum)) {
					if (typeof key !== "string") {
						return ("ENUM_PROPERTY_OBJECT_KEY_MALFORMED");
					}
					if (typeof criteria.enum[key] !== "number") {
						return ("ENUM_PROPERTY_OBJECT_VALUE_MALFORMED");
					}
				}
			} else {
				return ("ENUM_PROPERTY_MALFORMED");
			}
		}
		if (custom !== undefined && !isFunction(custom)) {
			return ("CUSTOM_PROPERTY_MALFORMED");
		}

		return (null);
	},
	check(chunk, criteria, value) {
		const { min, max, custom } = criteria;

		if (typeof value !== "number") {
			return ("TYPE_NUMBER_UNSATISFIED");
		}
		if (min !== undefined && value < min) {
			return ("MIN_UNSATISFIED");
		}
		if (max !== undefined && value > max) {
			return ("MAX_UNSATISFIED");
		}
		if (criteria.enum) {
			if (isArray(criteria.enum) && !criteria.enum.includes(value)) {
				return ("ENUM_UNSATISFIED");
			} else if (!Object.values(criteria.enum).includes(value)) {
				return ("ENUM_UNSATISFIED");
			}
		}
		if (custom && !custom(value)) {
			return ("CUSTOM_UNSATISFIED");
		}

		return (null);
	}
}
