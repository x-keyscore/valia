import type { StringSetableCriteria, StringErrorCodes, StringRejectCodes, StringCustomMembers } from "./types";
import type { Format } from "../types";
import { isPlainObject, isArray, isFunction, testers } from "../../../testers";

const stringTesters: Record<string, (...args: any[]) => boolean> = testers.string;

export const StringFormat: Format<StringSetableCriteria, StringErrorCodes, StringRejectCodes, StringCustomMembers> = {
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
		CONSTRAINT_PROPERTY_MISCONFIGURED:
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
	mountConstraint(definedConstraint) {
		if (!isPlainObject(definedConstraint)) {
			return ("CONSTRAINT_PROPERTY_MALFORMED");
		}

		const definedKeys = Reflect.ownKeys(definedConstraint);
		const setableKeys = Object.keys(stringTesters);

		if (definedKeys.length < 1) {
			return ("LITERAL_PROPERTY_OBJECT_MISCONFIGURED");
		}

		for (const definedKey of definedKeys) {
			const definedValue = definedConstraint[definedKey];

			if (typeof definedKey !== "string") {
				return ("CONSTRAINT_PROPERTY_OBJECT_KEY_MALFORMED");
			}
			if (!setableKeys.includes(definedKey)) {
				return ("CONSTRAINT_PROPERTY_OBJECT_KEY_MISCONFIGURED");
			}
			if (definedValue !== true && !isPlainObject(definedValue)) {
				return ("CONSTRAINT_PROPERTY_OBJECT_VALUE_MALFORMED");
			}
		}

		return (null);
	},
	mount(chunk, criteria) {
		const {  min, max, regex, literal, constraint, custom } = criteria;

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
			if (typeof regex !== "string" && !(regex instanceof RegExp)) {
				return ("REGEX_PROPERTY_MALFORMED");
			}
		}
		if (literal !== undefined) {
			if (isArray(literal)) {
				if (literal.length < 1) {
					return ("LITERAL_PROPERTY_ARRAY_MISCONFIGURED");
				}

				for (const item of literal) {
					if (typeof item !== "string") {
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
					if (typeof literal[key] !== "string") {
						return ("LITERAL_PROPERTY_OBJECT_VALUE_MALFORMED");
					}
				}
			} else if (typeof literal !== "string") {
				return ("LITERAL_PROPERTY_MALFORMED");
			}
		}
		if (constraint !== undefined) {
			const error = this.mountConstraint(constraint);
			if (error) return (error);
		}
		if (custom !== undefined && !isFunction(custom)) {
			return ("CUSTOM_PROPERTY_MALFORMED");
		}

		Object.assign(criteria, {
			regex: typeof regex === "string" ? new RegExp(regex) : regex
		});

		return (null);
	},
	checkConstraint(definedConstraint, value) {
		const definedKeys = Object.keys(definedConstraint);

		for (let i = definedKeys.length - 1; i >= 0; i--) {
			const definedKey = definedKeys[i];
			const definedValue = definedConstraint[definedKey];

			if (stringTesters[definedKey](value, definedValue)) {
				return (null);
			} else if (i === 0) {
				return ("CONSTRAINT_UNSATISFIED");
			}
		}

		return ("CONSTRAINT_UNSATISFIED");
	},
	check(chunk, criteria, value) {
		if (typeof value !== "string") {
			return ("TYPE_STRING_UNSATISFIED");
		}

		const {  min, max, regex, literal, constraint, custom } = criteria;
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
		if (constraint !== undefined) {
			const reject = this.checkConstraint(constraint, value);
			if (reject) return (reject);
		}
		if (custom && !custom(value)) {
			return ("CUSTOM_UNSATISFIED");
		}

		return (null);
	}
}
