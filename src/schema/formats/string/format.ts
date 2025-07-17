import type { StringSetableCriteria, SetableConstraint, StringErrorCodes, StringRejectCodes } from "./types";
import type { Format } from "../types";
import { isPlainObject, isArray, isFunction, testers } from "../../../testers";

const stringTesters: Map<string, (...args: any[]) => boolean> = new Map(Object.entries(testers.string));

export const StringFormat: Format<
	StringSetableCriteria,
	StringErrorCodes,
	StringRejectCodes
> = {
	type: "string",
	errors: {
		MIN_PROPERTY_MALFORMED:
			"The 'min' property must be of type Number.",
		MAX_PROPERTY_MALFORMED:
			"The 'max' property must be of type Number.",
		MIN_MAX_PROPERTIES_MISCONFIGURED:
			"The 'min' property cannot be greater than 'max' property.",
		REGEX_PROPERTY_MALFORMED:
			"The 'regex' property must be of type String or RegExp Object.",
		LITERAL_PROPERTY_MALFORMED:
			"The 'literal' property must be of type String, Array or Plain Object.",
		LITERAL_PROPERTY_ARRAY_MISCONFIGURED:
			"The array of the 'literal' property must contain at least one item.",
		LITERAL_PROPERTY_ARRAY_ITEM_MALFORMED:
			"The array items of the 'literal' property must be of type String.",
		LITERAL_PROPERTY_OBJECT_MISCONFIGURED:
			"The object of the 'literal' property must contain at least one key.",
		LITERAL_PROPERTY_OBJECT_KEY_MALFORMED:
			"The object keys of the 'literal' property must be of type String.",
		LITERAL_PROPERTY_OBJECT_VALUE_MALFORMED:
			"The object values of the 'literal' property must be of type String.",
		CONSTRAINT_PROPERTY_MALFORMED:
			"The 'constraint' property must be of type Plain Object.",
		CONSTRAINT_PROPERTY_OBJECT_MISCONFIGURED:
			"The object of the 'constraint' property must contain at least one key.",
		CONSTRAINT_PROPERTY_OBJECT_KEY_MALFORMED:
			"The object keys of the 'constraint' property must be of type String.",
		CONSTRAINT_PROPERTY_OBJECT_KEY_MISCONFIGURED:
			"The object keys of the 'constraint' property must be a known string.",
		CONSTRAINT_PROPERTY_OBJECT_VALUE_MALFORMED:
			"The object values of the 'constraint' property must be of type True or Plain Object.",
		CUSTOM_PROPERTY_MALFORMED:
			"The 'custom' property must be of type Basic Function."
	},
	mount(chunk, criteria) {
		const { min, max, regex, literal, constraint, custom } = criteria;

		if (min !== undefined && typeof min !== "number") {
			return ("MAX_PROPERTY_MALFORMED");
		}
		if (max !== undefined && typeof max !== "number") {
			return ("MAX_PROPERTY_MALFORMED");
		}
		if (min !== undefined && max !== undefined && min > max) {
			return ("MIN_MAX_PROPERTIES_MISCONFIGURED");
		}
		if (regex !== undefined) {
			if (typeof regex === "string") {
				Object.assign(criteria, {
					regex: new RegExp(regex)
				});
			}
			else if (!(regex instanceof RegExp)) {
				return ("REGEX_PROPERTY_MALFORMED");
			}
		}
		if (literal !== undefined) {
			let resolvedLiteral = undefined;

			if (typeof literal === "string") {
				resolvedLiteral = new Set([literal]);
			} else if (isArray(literal)) {
				if (literal.length < 1) {
					return ("LITERAL_PROPERTY_ARRAY_MISCONFIGURED");
				}

				for (const item of literal) {
					if (typeof item !== "string") {
						return ("LITERAL_PROPERTY_ARRAY_ITEM_MALFORMED");
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
						return ("LITERAL_PROPERTY_OBJECT_KEY_MALFORMED");
					}
					if (typeof literal[key] !== "string") {
						return ("LITERAL_PROPERTY_OBJECT_VALUE_MALFORMED");
					}
				}

				resolvedLiteral = new Set(Object.values(literal));
			} else {
				return ("LITERAL_PROPERTY_MALFORMED");
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
						return ("CONSTRAINT_PROPERTY_OBJECT_KEY_MALFORMED");
					}
					if (!stringTesters.has(key)) {
						return ("CONSTRAINT_PROPERTY_OBJECT_KEY_MISCONFIGURED");
					}

					const value = constraint[key as keyof SetableConstraint];
					if (typeof value !== "boolean" && !isPlainObject(value)) {
						return ("CONSTRAINT_PROPERTY_OBJECT_VALUE_MALFORMED");
					} else if (value === false) {
						continue;
					}

					resolvedConstraint.set(key, value);
				}

				Object.assign(criteria, { resolvedConstraint });
			} else {
				return ("CONSTRAINT_PROPERTY_MALFORMED");
			}
		}
		if (custom !== undefined && !isFunction(custom)) {
			return ("CUSTOM_PROPERTY_MALFORMED");
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
