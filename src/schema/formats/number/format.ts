import type { NumberSetableCriteria, NumberErrorCodes, NumberRejectCodes } from "./types";
import type { Format } from "../types";
import { isPlainObject, isArray, isFunction } from "../../../testers";

export const NumberFormat: Format<NumberSetableCriteria, NumberErrorCodes, NumberRejectCodes> = {
	type: "number",
	errors: {
        MIN_PROPERTY_MALFORMED:
		    "The 'min' property must be of type Number.",
       	MAX_PROPERTY_MALFORMED:
            "The 'max' property must be of type Number.",
        MIN_AND_MAX_PROPERTIES_MISCONFIGURED:
			"The 'min' property cannot be greater than 'max' property.",
        LITERAL_PROPERTY_MALFORMED:
			"The 'literal' property must be of type Number, Array or Plain Object.",
		LITERAL_PROPERTY_ARRAY_MISCONFIGURED:
			"The array of the 'literal' property must contain at least one item.",
		LITERAL_PROPERTY_ARRAY_ITEM_MALFORMED:
			"The array items of the 'literal' property must be of type Number.",
		LITERAL_PROPERTY_OBJECT_MISCONFIGURED:
			"The object of the 'literal' property must contain at least one key.",
		LITERAL_PROPERTY_OBJECT_KEY_MALFORMED:
			"The object keys of the 'literal' property must be of type String.",
		LITERAL_PROPERTY_OBJECT_VALUE_MALFORMED:
			"The object values of the 'literal' property must be of type Number.",
        CUSTOM_PROPERTY_MALFORMED:
            "The 'custom' property must be of type Basic Function."
    },
	mount(chunk, criteria) {
		const {  min, max, literal, custom } = criteria;

		if (min !== undefined && typeof min !== "number") {
			return ("MIN_PROPERTY_MALFORMED");
		}
		if (max !== undefined && typeof max !== "number") {
			return ("MAX_PROPERTY_MALFORMED");
		}
		if (min !== undefined && max !== undefined && min > max) {
			return ("MIN_AND_MAX_PROPERTIES_MISCONFIGURED");
		}
		if (literal !== undefined) {
			if (isArray(literal)) {
				if (literal.length < 1) {
					return ("LITERAL_PROPERTY_ARRAY_MISCONFIGURED");
				}

				for (const item of literal) {
					if (typeof item !== "number") {
						return ("LITERAL_PROPERTY_ARRAY_ITEM_MALFORMED");
					}
				}
			} else if (isPlainObject(literal)) {
				const keys = Reflect.ownKeys(literal);
				if (keys.length < 1) {
					return ("LITERAL_PROPERTY_OBJECT_MISCONFIGURED");
				}

				for (const key of keys) {
					if (typeof key !== "string") {
						return ("LITERAL_PROPERTY_OBJECT_KEY_MALFORMED");
					}
					if (typeof literal[key] !== "number") {
						return ("LITERAL_PROPERTY_OBJECT_VALUE_MALFORMED");
					}
				}
			} else if (typeof literal !== "number") {
				return ("LITERAL_PROPERTY_MALFORMED");
			}
		}
		if (custom !== undefined && !isFunction(custom)) {
			return ("CUSTOM_PROPERTY_MALFORMED");
		}

		return (null);
	},
	check(chunk, criteria, value) {
		if (typeof value !== "number") {
			return ("TYPE_NUMBER_UNSATISFIED");
		}

		const { min, max, literal, custom } = criteria;

		if (min !== undefined && value < min) {
			return ("MIN_UNSATISFIED");
		}
		if (max !== undefined && value > max) {
			return ("MAX_UNSATISFIED");
		}
		if (literal !== undefined) {
			if (isArray(literal)) {
				if (!literal.includes(value)) {
					return ("LITERAL_UNSATISFIED");
				}
			}
			else if (isPlainObject(literal)) {
				if (!Object.values(literal).includes(value)) {
					return ("LITERAL_UNSATISFIED");
				}
			} else if (literal !== value) {
				return ("LITERAL_UNSATISFIED");
			}
		}
		if (custom && !custom(value)) {
			return ("CUSTOM_UNSATISFIED");
		}

		return (null);
	}
}
