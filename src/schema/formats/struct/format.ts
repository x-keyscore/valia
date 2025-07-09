/*
import type { StructSetableCriteria, SetableStruct, StructErrors, StringRejects, StructMembers } from "./types";
import type { Format } from "../types";
import { isObject, isPlainObject, isArray } from "../../../testers";

export const StructFormat: Format<StructSetableCriteria, StructErrors, StringRejects, StructMembers> = {
	type: "struct",
	errors: {
		STRUCT_PROPERTY_REQUIRED:
		    "The 'struct' property is required.",
        STRUCT_PROPERTY_MALFORMED:
		    "The 'struct' property must be of type Plain Object.",
        STRUCT_PROPERTY_OBJECT_VALUE_MALFORMED:
            "The object values of the 'struct' property must be of type Plain Object.",
		STRICT_PROPERTY_MALFORMED:
            "The 'strict' property must be of type Boolean.",
        OPTIONAL_PROPERTY_MALFORMED:
            "The 'optional' property must be of type Boolean or Array.",
        OPTIONAL_PROPERTY_ARRAY_ITEM_MALFORMED:
            "The array items of the 'optional' property must be of type String or Symbol.",
        ADDITIONAL_PROPERTY_MALFORMED:
            "The 'additional' property must be of type Boolean or a Plain Object.",
        ADDITIONAL_PROPERTY_OBJECT_MISCONFIGURED:
            "The object of the 'additional' property, must be a 'object’ criteria node."
    },
	getUnforcedKeys(optional, includedKeys) {
		if (optional === true) return (includedKeys);
		if (optional === false) return ([]);

		return (includedKeys.filter(key => optional.includes(key)));
	},
	getRequiredKeys(optional, includedKeys) {
		if (optional === true) return ([]);
		if (optional === false) return (includedKeys);

		return (includedKeys.filter(key => !optional.includes(key)));
	},
	isShorthandStruct(obj): obj is SetableStruct {
		return (isPlainObject(obj));
	},
	mount(chunk, criteria) {
		if (!("struct" in criteria)) {
			return ("STRUCT_PROPERTY_REQUIRED");
		}
		if (!isPlainObject(criteria.struct)) {
			return ("STRUCT_PROPERTY_MALFORMED");
		}
		for (const value of Object.values(criteria.struct)) {
			if (!isPlainObject(value)) {
				return ("STRUCT_PROPERTY_OBJECT_VALUE_MALFORMED");
			}
		}
		if (criteria.strict !== undefined && typeof criteria.strict !== "boolean") {
			return ("STRICT_PROPERTY_MALFORMED");
		}
		if (criteria.optional !== undefined) {
			if (isArray(criteria.optional)) {
				for (const item of criteria.optional) {
					if (typeof item !== "string" && typeof item !== "symbol") {
						return ("OPTIONAL_PROPERTY_ARRAY_ITEM_MALFORMED");
					}
				}
			} else if (typeof criteria.optional !== "boolean") {
				return ("OPTIONAL_PROPERTY_MALFORMED");
			}
		}
		if (criteria.additional !== undefined) {
			if (isPlainObject(criteria.additional)) {
				if (criteria.additional?.type !== "object") {
					return ("ADDITIONAL_PROPERTY_OBJECT_MISCONFIGURED");
				}
			} else if (typeof criteria.additional !== "boolean") {
				return ("ADDITIONAL_PROPERTY_MALFORMED")
			}
		}

		const optional = criteria.optional ?? false;
		const additional = criteria.additional ?? false;
		const includedKeyArray = Reflect.ownKeys(criteria.struct);
		const unforcedKeyArray = this.getUnforcedKeys(optional, includedKeyArray);
		const requiredKeyArray = this.getRequiredKeys(optional, includedKeyArray);

		Object.assign(criteria, {
			optional: optional,
			additional: additional,
			includedKeySet: new Set(includedKeyArray),
			unforcedKeySet: new Set(unforcedKeyArray),
			requiredKeySet: new Set(requiredKeyArray)
		});

		for (let i = 0; i < includedKeyArray.length; i++) {
			const key = includedKeyArray[i];
			let node = criteria.struct[key];

			if (this.isShorthandStruct(node)) {
				node = {
					type: "struct",
					struct: node
				}
				criteria.struct[key] = node;
			}

			chunk.push({
				node: node,
				partPaths: {
					explicit: ["struct", key],
					implicit: ["&", key]
				}
			});
		}

		if (typeof additional !== "boolean") {
			chunk.push({
				node: additional,
				partPaths: {
					explicit: ["additional"],
					implicit: []
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
		} else {
			if (!isObject(data)) {
				return ("TYPE_OBJECT_UNSATISFIED");
			}
		}

		const {
			struct,
			additional,
			includedKeySet,
			unforcedKeySet,
			requiredKeySet
		} = criteria;

		const includedKeyCount = includedKeySet.size;
		const requiredKeyCount = requiredKeySet.size;

		const definedKeyArray = Reflect.ownKeys(data);
		const definedKeyCount = definedKeyArray.length;
		
		if (definedKeyCount < requiredKeyCount) {
			return ("STRUCT_UNSATISFIED");
		}
		if (!additional && definedKeyCount > includedKeyCount) {
			return ("ADDITIONAL_UNALLOWED");
		}

		if (typeof additional === "boolean") {
			let requiredMiss = requiredKeyCount;
			for (let i = 0; i < definedKeyCount; i++) {
				const key = definedKeyArray[i];

				if (requiredKeySet.has(key)) {
					requiredMiss--;
				}
				else if (requiredMiss > i) {
					return ("STRUCT_UNSATISFIED");
				}
				else if (!unforcedKeySet.has(key)) {
					if (!additional) {
						return ("ADDITIONAL_UNALLOWED");
					}
					continue;
				}

				chunk.push({
					data: data[key],
					node: struct[key]
				});
			}
		} else {
			const additionalProperties: Record<string | symbol, unknown> = {};

			let requiredMiss = requiredKeyCount;
			for (let i = 0; i < definedKeyCount; i++) {
				const key = definedKeyArray[i];

				if (requiredKeySet.has(key)) {
					requiredMiss--;
				}
				else if (requiredMiss > i) {
					return ("STRUCT_UNSATISFIED");
				}
				else if (!unforcedKeySet.has(key)) {
					additionalProperties[key] = data[key];
					continue;
				}

				chunk.push({
					data: data[key],
					node: struct[key]
				});
			}

			chunk.push({
				data: additionalProperties,
				node: additional
			});
		}

		return (null);
	}
}
*/