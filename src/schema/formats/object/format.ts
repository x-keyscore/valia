import type { ObjectSetableCriteria, ObjectErrors, ObjectRejects } from "./types";
import type { Format } from "../types";
import { isObject, isPlainObject } from "../../../testers";

export const ObjectFormat: Format<ObjectSetableCriteria, ObjectErrors, ObjectRejects> = {
	type: "object",
	errors: {
		KEY_PROPERTY_REQUIRED:
			"The 'key' property is required.",
		KEY_PROPERTY_MALFORMED:
		    "The 'key' property must be of type Plain Object.",
		VALUE_PROPERTY_REQUIRED:
            "The 'value' property is required.",
        VALUE_PROPERTY_MALFORMED:
            "The 'value' property must be of type Plain Object.",
		STRICT_PROPERTY_MALFORMED:
            "The 'strict' property must be of type Boolean.",
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
		const { strict, empty, min, max } = criteria;

		if (criteria.key !== undefined && !isPlainObject(criteria.key)) {
			return ("KEY_PROPERTY_MALFORMED");
		}
		if (criteria.value !== undefined && !isPlainObject(criteria.value)) {
			return ("VALUE_PROPERTY_MALFORMED");
		}
		if (strict !== undefined && typeof strict !== "boolean") {
			return ("STRICT_PROPERTY_MALFORMED");
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
			strict: strict ?? true,
			empty: empty ?? true
		});

		if (criteria.key) {
			chunk.push({
				node: criteria.key,
				partPaths: {
					explicit: ["key"],
					implicit: []
				}
			});
		}

		if (criteria.value) {
			chunk.push({
				node: criteria.value,
				partPaths: {
					explicit: ["value"],
					implicit: ["%", "string", "symbol"]
				}
			});
		}

		return (null);
	},
	check(chunk, criteria, data) {
		if (criteria.strict) {
			if (!isPlainObject(data)) {
				return ("TYPE_PLAIN_OBJECT_UNSATISFIED");
			}
		} else if (!isObject(data)) {
			return ("TYPE_OBJECT_UNSATISFIED");
		}

		const { empty, min, max } = criteria;
		const definedKeyArray = Reflect.ownKeys(data);
		const definedkeyCount = definedKeyArray.length;

		if (definedkeyCount === 0) {
			return (empty ? null : "EMPTY_UNALLOWED");
		}
		if (min != null && definedkeyCount < min) {
			return ("MIN_UNSATISFIED");
		}
		if (max != null && definedkeyCount > max) {
			return ("MAX_UNSATISFIED");
		}

		if (criteria.key || criteria.value) {
			for (let i = 0; i < definedkeyCount; i++) {
				const key = definedKeyArray[i];

				if (criteria.key) {
					chunk.push({
						data: key,
						node: criteria.key
					})
				}
				if (criteria.value) {
					chunk.push({
						data: data[key],
						node: criteria.value
					});
				}
			}
		}

		return (null);
	}
}