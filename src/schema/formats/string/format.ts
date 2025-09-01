import type { StringSetableCriteria, SetableConstraint, StringExceptionCodes, StringRejectionCodes } from "./types";
import type { Format } from "../types";
import { isPlainObject, isArray, isFunction, testers } from "../../../testers";

const stringTesters: Map<string, (...args: any[]) => boolean> = new Map(Object.entries(testers.string));

export const StringFormat: Format<
	StringSetableCriteria,
	StringExceptionCodes,
	StringRejectionCodes
> = {
	type: "string",
	exceptions: {
		MIN_PROPERTY_MISDECLARED:
			"The 'min' property must be of type number.",
		MAX_PROPERTY_MISDECLARED:
			"The 'max' property must be of type number.",
		MIN_MAX_PROPERTIES_MISCONFIGURED:
			"The 'min' property cannot be greater than 'max' property.",
		REGEX_PROPERTY_MISDECLARED:
			"The 'regex' property must be of type RegExp object.",
		LITERAL_PROPERTY_MISDECLARED:
			"The 'literal' property must be of type string, array or plain object.",
		LITERAL_PROPERTY_ARRAY_MISCONFIGURED:
			"The array of the 'literal' property must have a number of items greater than 0.",
		LITERAL_PROPERTY_ARRAY_ITEM_MISDECLARED:
			"The array items of the 'literal' property must be of type String.",
		LITERAL_PROPERTY_OBJECT_MISCONFIGURED:
			"The object of the 'literal' property must have a number of keys greater than 0.",
		LITERAL_PROPERTY_OBJECT_KEY_MISDECLARED:
			"The object keys of the 'literal' property must be of type string.",
		LITERAL_PROPERTY_OBJECT_VALUE_MISDECLARED:
			"The object values of the 'literal' property must be of type string.",
		CONSTRAINT_PROPERTY_MISDECLARED:
			"The 'constraint' property must be of type Plain Object.",
		CONSTRAINT_PROPERTY_OBJECT_MISCONFIGURED:
			"The object of the 'constraint' property must have a number of keys greater than 0.",
		CONSTRAINT_PROPERTY_OBJECT_KEY_MISDECLARED:
			"The object keys of the 'constraint' property must be of type string.",
		CONSTRAINT_PROPERTY_OBJECT_KEY_MISCONFIGURED:
			"The object keys of the 'constraint' property must be a known string.",
		CONSTRAINT_PROPERTY_OBJECT_VALUE_MISDECLARED:
			"The object values of the 'constraint' property must be of type true or plain object.",
		CUSTOM_PROPERTY_MISDECLARED:
			"The 'custom' property must be of type basic function."
	},
	mount(chunk, criteria) {
		const { min, max, regex, literal, constraint, custom } = criteria;

		if (min !== undefined && typeof min !== "number") {
			return ("MIN_PROPERTY_MISDECLARED");
		}
		if (max !== undefined && typeof max !== "number") {
			return ("MAX_PROPERTY_MISDECLARED");
		}
		if (min !== undefined && max !== undefined && min > max) {
			return ("MIN_MAX_PROPERTIES_MISCONFIGURED");
		}
		if (regex !== undefined && !(regex instanceof RegExp)) {
			return ("REGEX_PROPERTY_MISDECLARED");
		}
		if (literal !== undefined) {
			let resolvedLiteral;

			if (typeof literal === "string") {
				resolvedLiteral = new Set([literal]);
			} else if (isArray(literal)) {
				if (literal.length < 1) {
					return ("LITERAL_PROPERTY_ARRAY_MISCONFIGURED");
				}

				for (const item of literal) {
					if (typeof item !== "string") {
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
					if (typeof literal[key] !== "string") {
						return ("LITERAL_PROPERTY_OBJECT_VALUE_MISDECLARED");
					}
				}

				resolvedLiteral = new Set(Object.values(literal));
			} else {
				return ("LITERAL_PROPERTY_MISDECLARED");
			}

			Object.assign(criteria, { resolvedLiteral });
		}
		if (constraint !== undefined) {
			if (isPlainObject(constraint)) {
				const keys = Reflect.ownKeys(constraint);
				if (keys.length < 1) {
					return ("CONSTRAINT_PROPERTY_OBJECT_MISCONFIGURED");
				}

				const resolvedConstraint = new Map();
				for (const key of keys) {
					if (typeof key !== "string") {
						return ("CONSTRAINT_PROPERTY_OBJECT_KEY_MISDECLARED");
					}
					if (!stringTesters.has(key)) {
						return ("CONSTRAINT_PROPERTY_OBJECT_KEY_MISCONFIGURED");
					}

					const value = constraint[key as keyof SetableConstraint];
					if (typeof value !== "boolean" && !isPlainObject(value)) {
						return ("CONSTRAINT_PROPERTY_OBJECT_VALUE_MISDECLARED");
					}
					
					if (value === false) continue;

					if (value === true) {
						resolvedConstraint.set(key, undefined);
					}
					else {
						resolvedConstraint.set(key, value);
					}
				}

				Object.assign(criteria, { resolvedConstraint });
			} else {
				return ("CONSTRAINT_PROPERTY_MISDECLARED");
			}
		}
		if (custom !== undefined && !isFunction(custom)) {
			return ("CUSTOM_PROPERTY_MISDECLARED");
		}

		return (null);
	},
	check(chunk, criteria, value) {
		if (typeof value !== "string") {
			return ("TYPE_STRING_UNSATISFIED");
		}

		const { min, max, regex, resolvedLiteral, resolvedConstraint, custom } = criteria;
		const valueLength = value.length;

		if (min !== undefined && valueLength < min) {
			return ("MIN_UNSATISFIED");
		}
		if (max !== undefined && valueLength > max) {
			return ("MAX_UNSATISFIED");
		}
		if (regex !== undefined && !regex.test(value)) {
			return ("REGEX_UNSATISFIED");
		}
		if (resolvedLiteral !== undefined && !resolvedLiteral.has(value)) {
			return ("LITERAL_UNSATISFIED");
		}
		if (resolvedConstraint !== undefined) {
			let isAccept = false;

			for (const [key, config] of resolvedConstraint) {
				if (stringTesters.get(key)!(value, config)) {
					isAccept = true;
					break;
				}
			}

			if (!isAccept) {
				return ("CONSTRAINT_UNSATISFIED");
			}
		}
		if (custom && !custom(value)) {
			return ("CUSTOM_UNSATISFIED");
		}

		return (null);
	}
}
