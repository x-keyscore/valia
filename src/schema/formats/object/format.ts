import type { ObjectSetableCriteria, SetableShape, ObjectErrors, ObjectRejects, ObjectMembers } from "./types";
import type { Format } from "../types";
import { isObject, isPlainObject, isArray } from "../../../testers";

export const ObjectFormat: Format<ObjectSetableCriteria, ObjectErrors, ObjectRejects, ObjectMembers> = {
	type: "object",
	errors: {
		SHAPE_PROPERTY_REQUIRED:
			"The 'shape' property is required.",
		SHAPE_PROPERTY_MALFORMED:
			"The 'shape' property must be of type Plain Object.",
		SHAPE_PROPERTY_OBJECT_VALUE_MALFORMED:
			"The object values of the 'shape' property must be of type Plain Object.",
		STRICT_PROPERTY_MALFORMED:
			"The 'strict' property must be of type Boolean.",
		OMITTABLE_PROPERTY_MALFORMED:
			"The 'omittable' property must be of type Boolean or Array.",
		OMITTABLE_PROPERTY_ARRAY_ITEM_MALFORMED:
			"The array items of the 'omittable' property must be of type String or Symbol.",
		EXPANDABLE_PROPERTY_MALFORMED:
			"The 'expandable' property must be of type Boolean or a Plain Object.",
		EXPANDABLE__KEY_PROPERTY_MALFORMED:
			"The 'expandable.key' property, must be a criteria node Object.",
		EXPANDABLE__VALUE_PROPERTY_MALFORMED:
			"The 'expandable.value' property, must be a criteria node Object.",
		EXPANDABLE__MIN_PROPERTY_MALFORMED:
			"The 'expandable.min' property, must be of type Number.",
		EXPANDABLE__MAX_PROPERTY_MALFORMED:
			"The 'expandable.max' property, must be of type Number.",
		EXPANDABLE__MIN_AND_MAX_PROPERTIES_MISCONFIGURED:
			"The 'expandable.min' property cannot be greater than 'expandable.max' property."
	},
	getUnforcedKeys(optional, declaredKeys) {
		if (optional === true) return (declaredKeys);
		if (optional === false) return ([]);

		return (declaredKeys.filter(key => optional.includes(key)));
	},
	getEnforcedKeys(optional, declaredKeys) {
		if (optional === true) return ([]);
		if (optional === false) return (declaredKeys);

		return (declaredKeys.filter(key => !optional.includes(key)));
	},
	isShorthandShape(obj): obj is SetableShape {
		return (isPlainObject(obj) && "type" in obj && typeof obj.type !== "string");
	},
	mount(chunk, criteria) {
		const { shape, strict, omittable, expandable } = criteria;

		if (!("shape" in criteria)) {
			return ("SHAPE_PROPERTY_REQUIRED");
		}
		if (!isPlainObject(shape)) {
			return ("SHAPE_PROPERTY_MALFORMED");
		}
		for (const key of Reflect.ownKeys(shape)) {
			if (!isPlainObject(shape[key])) {
				return ("SHAPE_PROPERTY_OBJECT_VALUE_MALFORMED");
			}
		}
		if (strict !== undefined && typeof strict !== "boolean") {
			return ("STRICT_PROPERTY_MALFORMED");
		}
		if (omittable !== undefined) {
			if (isArray(omittable)) {
				for (const item of omittable) {
					if (typeof item !== "string" && typeof item !== "symbol") {
						return ("OMITTABLE_PROPERTY_ARRAY_ITEM_MALFORMED");
					}
				}
			} else if (typeof omittable !== "boolean") {
				return ("OMITTABLE_PROPERTY_MALFORMED");
			}
		}
		if (expandable !== undefined) {
			if (isPlainObject(expandable)) {
				const { key, value, min, max } = expandable;

				if (key !== undefined && !isPlainObject(key)) {
					return ("EXPANDABLE__KEY_PROPERTY_MALFORMED");
				}
				if (value !== undefined && !isPlainObject(value)) {
					return ("EXPANDABLE__VALUE_PROPERTY_MALFORMED");
				}
				if (min !== undefined && typeof min !== "number") {
					return ("EXPANDABLE__MIN_PROPERTY_MALFORMED");
				}
				if (max !== undefined && typeof max !== "number") {
					return ("EXPANDABLE__MAX_PROPERTY_MALFORMED");
				}
				if (min !== undefined && max !== undefined && min > max) {
					return ("EXPANDABLE__MIN_AND_MAX_PROPERTIES_MISCONFIGURED");
				}
			} else if (typeof omittable !== "boolean") {
				return ("EXPANDABLE_PROPERTY_MALFORMED");
			}
		}

		const resolvedOmittable = omittable ?? false;
		const resolvedExpandable = expandable ?? false;
		const declaredKeyArray = Reflect.ownKeys(shape);
		const unforcedKeyArray = this.getUnforcedKeys(resolvedOmittable, declaredKeyArray);
		const enforcedKeyArray = this.getEnforcedKeys(resolvedOmittable, declaredKeyArray);

		Object.assign(criteria, {
			strict: strict ?? true,
			omittable: resolvedOmittable,
			expandable: resolvedExpandable,
			declaredKeySet: new Set(declaredKeyArray),
			unforcedKeySet: new Set(unforcedKeyArray),
			enforcedKeySet: new Set(enforcedKeyArray)
		});

		for (let i = 0; i < declaredKeyArray.length; i++) {
			const key = declaredKeyArray[i];
			let node = shape[key];

			if (this.isShorthandShape(node)) {
				node = {
					type: "object",
					shape: node
				}
				shape[key] = node;
			}

			chunk.push({
				node: node,
				partPaths: {
					explicit: ["shape", key],
					implicit: ["&", key]
				}
			});
		}

		if (typeof resolvedExpandable === "object") {
			if (resolvedExpandable.key) {
				chunk.push({
					node: resolvedExpandable.key,
					partPaths: {
						explicit: ["expandable", "key"],
						implicit: []
					}
				});
			}
			if (resolvedExpandable.value) {
				chunk.push({
					node: resolvedExpandable.value,
					partPaths: {
						explicit: ["expandable", "value"],
						implicit: ["%", "string", "symbol"]
					}
				});
			}
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

		const {
			shape, expandable,
			declaredKeySet, unforcedKeySet, enforcedKeySet
		} = criteria;

		const declaredKeyCount = declaredKeySet.size;
		const enforcedKeyCount = enforcedKeySet.size;

		const definedKeyArray = Reflect.ownKeys(data);
		const definedKeyCount = definedKeyArray.length;
		
		if (definedKeyCount < enforcedKeyCount) {
			return ("STRUCT_UNSATISFIED");
		}
		if (!expandable && definedKeyCount > declaredKeyCount) {
			return ("ADDITIONAL_UNALLOWED");
		}

		if (typeof expandable === "boolean") {
			let enforcedMiss = enforcedKeyCount;
			for (let i = 0; i < definedKeyCount; i++) {
				const key = definedKeyArray[i];

				if (enforcedKeySet.has(key)) {
					enforcedMiss--;
				}
				else if (enforcedMiss > i) {
					return ("STRUCT_UNSATISFIED");
				}
				else if (!unforcedKeySet.has(key)) {
					if (!expandable) {
						return ("ADDITIONAL_UNALLOWED");
					}
					continue;
				}

				chunk.push({
					data: data[key],
					node: shape[key]
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
		/*

		const { strict, empty, min, max } = criteria;
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

		return (null);*/
	}
}