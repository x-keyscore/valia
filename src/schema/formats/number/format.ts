import type { NumberSetableCriteria, NumberExceptionCodes, NumberRejectionCodes } from "./types";
import type { Format } from "../types";
import { isPlainObject, isArray, isFunction } from "../../../testers";

export const NumberFormat: Format<
	NumberSetableCriteria,
	NumberExceptionCodes,
	NumberRejectionCodes
> = {
	type: "number",
	exceptions: {
        MIN_PROPERTY_MISDECLARED:
		    "The 'min' property must be of type number.",
       	MAX_PROPERTY_MISDECLARED:
            "The 'max' property must be of type number.",
        MIN_MAX_PROPERTIES_MISCONFIGURED:
			"The 'max' property cannot be less than 'min' property.",
        LITERAL_PROPERTY_MISDECLARED:
			"The 'literal' property must be of type number, array or plain object.",
		LITERAL_PROPERTY_ARRAY_MISCONFIGURED:
			"The array of the 'literal' property must have a number of items greater than 0.",
		LITERAL_PROPERTY_ARRAY_ITEM_MISDECLARED:
			"The array items of the 'literal' property must be of type number.",
		LITERAL_PROPERTY_OBJECT_MISCONFIGURED:
			"The object of the 'literal' property must have a number of keys greater than 0.",
		LITERAL_PROPERTY_OBJECT_KEY_MISDECLARED:
			"The object keys of the 'literal' property must be of type string.",
		LITERAL_PROPERTY_OBJECT_VALUE_MISDECLARED:
			"The object values of the 'literal' property must be of type number.",
        CUSTOM_PROPERTY_MISDECLARED:
            "The 'custom' property must be of type basic function."
    },
	mount(chunk, criteria) {
		const { min, max, literal, custom } = criteria;

		if (min !== undefined && typeof min !== "number") {
			return ("MIN_PROPERTY_MISDECLARED");
		}
		if (max !== undefined && typeof max !== "number") {
			return ("MAX_PROPERTY_MISDECLARED");
		}
		if (min !== undefined && max !== undefined && min > max) {
			return ("MIN_MAX_PROPERTIES_MISCONFIGURED");
		}

		if (literal !== undefined) {
			let resolvedLiteral;

			if (typeof literal === "number") {
				resolvedLiteral = new Set([literal]);
			} else if (isArray(literal)) {
				if (literal.length < 1) {
					return ("LITERAL_PROPERTY_ARRAY_MISCONFIGURED");
				}

				for (const item of literal) {
					if (typeof item !== "number") {
						return ("LITERAL_PROPERTY_ARRAY_ITEM_MISDECLARED");
					}
				}

				resolvedLiteral = new Set(literal);
			} else if (isPlainObject(literal)) {
				const keys = Reflect.ownKeys(literal);
				if (keys.length < 1) {
					return ("LITERAL_PROPERTY_OBJECT_MISCONFIGURED");
				}

				for (const key of keys) {
					if (typeof key !== "string") {
						return ("LITERAL_PROPERTY_OBJECT_KEY_MISDECLARED");
					}
					if (typeof literal[key] !== "number") {
						return ("LITERAL_PROPERTY_OBJECT_VALUE_MISDECLARED");
					}
				}

				resolvedLiteral = new Set(Object.values(literal));
			} else {
				return ("LITERAL_PROPERTY_MISDECLARED");
			}

			Object.assign(criteria, { resolvedLiteral });
		}
		if (custom !== undefined && !isFunction(custom)) {
			return ("CUSTOM_PROPERTY_MISDECLARED");
		}

		return (null);
	},
	check(chunk, criteria, value) {
		if (typeof value !== "number") {
			return ("TYPE_NUMBER_UNSATISFIED");
		}

		const { min, max, resolvedLiteral, custom } = criteria;

		if (min !== undefined && value < min) {
			return ("MIN_UNSATISFIED");
		}
		if (max !== undefined && value > max) {
			return ("MAX_UNSATISFIED");
		}
		if (resolvedLiteral !== undefined && !resolvedLiteral.has(value)) {
			return ("LITERAL_UNSATISFIED");
		}
		if (custom && !custom(value)) {
			return ("CUSTOM_UNSATISFIED");
		}

		return (null);
	}
}
