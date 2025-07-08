import type { StringSetableCriteria, StringErrors, StringRejects, StringMembers } from "./types";
import type { Format } from "../types";
import { isPlainObject, isArray, isFunction, testers } from "../../../testers";

const stringTesters: Record<string, (...args: any[]) => boolean> = testers.string;

export const StringFormat: Format<StringSetableCriteria, StringErrors, StringRejects, StringMembers> = {
	type: "string",
	errors: {
		EMPTY_PROPERTY_MALFORMED:
		    "The 'empty' property must be of type Boolean.",
        MIN_PROPERTY_MALFORMED:
            "The 'min' property must be of type Number.",
        MAX_PROPERTY_MALFORMED:
            "The 'max' property must be of type Number.",
        MIN_MAX_PROPERTIES_MISCONFIGURED:
            "The 'min' property cannot be greater than 'max' property.",
       	ENUM_PROPERTY_MALFORMED:
            "The 'enum' property must be of type Array or Plain Object.",
        ENUM_PROPERTY_ARRAY_ITEM_MALFORMED:
			"The array items of the 'enum' property must be of type Number.",
		ENUM_PROPERTY_OBJECT_KEY_MALFORMED:
			"The object keys of the 'enum' property must be of type String.",
        ENUM_PROPERTY_OBJECT_VALUE_MALFORMED:
			"The object values of the 'enum' property must be of type Number.",
        REGEX_PROPERTY_MALFORMED:
            "The 'regex' property must be of type String or RegExp Object.",
        TESTERS_PROPERTY_MALFORMED:
            "The 'testers' property must be of type Plain Object.",
        TESTERS_PROPERTY_OBJECT_KEY_MALFORMED:
            "The object keys of the 'testers' property must be a name of string testers.",
        TESTERS_PROPERTY_OBJECT_VALUE_MALFORMED:
            "The object values of the 'testers' property must be type Boolean or Plain Object.",
        CUSTOM_PROPERTY_MALFORMED:
            "The 'custom' property must be of type Basic Function."
	},
	mountTesters(definedTesters) {
		const definedTestersKeys = Reflect.ownKeys(definedTesters);
		const stringTestersKeys = Object.keys(stringTesters);

		for (const definedKey of definedTestersKeys) {
			const definedValue = definedTesters[definedKey];

			if (typeof definedKey !== "string" || !stringTestersKeys.includes(definedKey)) {
				return ("TESTERS_PROPERTY_OBJECT_KEY_MALFORMED");
			} else if (!isPlainObject(definedValue) && typeof definedValue !== "boolean") {
				return ("TESTERS_PROPERTY_OBJECT_VALUE_MALFORMED");
			}
		}

		return (null);
	},
	mount(chunk, criteria) {
		const { empty, min, max, regex, custom } = criteria;

		if (empty !== undefined && typeof empty !== "boolean") {
			return ("EMPTY_PROPERTY_MALFORMED");
		}
		if (min !== undefined && typeof min !== "number") {
			return ("MAX_PROPERTY_MALFORMED");
		}
		if (max !== undefined && typeof max !== "number") {
			return ("MAX_PROPERTY_MALFORMED");
		}
		if (min !== undefined && max !== undefined && min > max) {
			return ("MIN_MAX_PROPERTIES_MISCONFIGURED");
		}
		if (criteria.enum !== undefined) {
			if (isArray(criteria.enum)) {
				for (const item of criteria.enum) {
					if (typeof item !== "string") {
						return ("ENUM_PROPERTY_ARRAY_ITEM_MALFORMED");
					}
				}
			} else if (isPlainObject(criteria.enum)) {
				for (const key of Reflect.ownKeys(criteria.enum)) {
					if (typeof key !== "string") {
						return ("ENUM_PROPERTY_OBJECT_KEY_MALFORMED");
					}
					if (typeof criteria.enum[key] !== "string") {
						return ("ENUM_PROPERTY_OBJECT_VALUE_MALFORMED");
					}
				}
			} else {
				return ("ENUM_PROPERTY_MALFORMED");
			}
		}
		if (regex !== undefined && typeof regex !== "string" && !(regex instanceof RegExp)) {
			return ("REGEX_PROPERTY_MALFORMED");
		}
		if (criteria.testers !== undefined) {
			if (!isPlainObject(criteria.testers)) {
				return ("TESTERS_PROPERTY_MALFORMED");
			}

			const error = this.mountTesters(criteria.testers);
			if (error) return (error);
		}
		if (custom !== undefined && !isFunction(custom)) {
			return ("CUSTOM_PROPERTY_MALFORMED");
		}

		Object.assign(criteria, {
			empty: empty ?? true,
			regex: typeof regex === "string" ? new RegExp(regex) : regex
		});

		return (null);
	},
	checkTesters(definedTesters, value) {
		const definedTestersKeys = Object.keys(definedTesters);

		for (const key of definedTestersKeys) {
			const config = definedTesters[key];
			if (config === false) continue;

			if (!stringTesters[key](value, config ?? undefined)) {
				return ("TESTERS_UNSATISFIED");
			}
		}

		return (null);
	},
	check(chunk, criteria, value) {
		if (typeof value !== "string") {
			return ("TYPE_STRING_UNSATISFIED");
		}

		const { empty, min, max, regex, custom } = criteria;
		const valueLength = value.length;

		if (!valueLength) {
			return (empty ? null : "EMPTY_UNALLOWED");
		}
		if (min !== undefined && valueLength < min) {
			return ("MIN_UNSATISFIED");
		}
		if (max !== undefined && valueLength > max) {
			return ("MAX_UNSATISFIED");
		}
		if (criteria.enum) {
			if (isArray(criteria.enum) && !criteria.enum.includes(value)) {
				return ("ENUM_UNSATISFIED");
			} else if (!Object.values(criteria.enum).includes(value)) {
				return ("ENUM_UNSATISFIED");
			}
		}
		if (regex && !regex.test(value)) {
			return ("REGEX_UNSATISFIED");
		}
		if (criteria.testers) {
			const reject = this.checkTesters(criteria.testers, value);
			if (reject) return (reject);
		}
		if (custom && !custom(value)) {
			return ("CUSTOM_UNSATISFIED");
		}

		return (null);
	}
}
