import type { ObjectSetableCriteria, SetableShape, ObjectErrors, ObjectRejects, ObjectMembers } from "./types";
import type { Format } from "../types";
import { isObject, isPlainObject, isArray } from "../../../testers";
import { isObjectLike } from "../../../testers/object/object";

export const ObjectFormat: Format<ObjectSetableCriteria, ObjectErrors, ObjectRejects, ObjectMembers> = {
	type: "object",
	errors: {
		SHAPE_PROPERTY_REQUIRED:
			"The 'shape' property is required.",
		SHAPE_PROPERTY_MALFORMED:
			"The 'shape' property must be of type Plain Object.",
		SHAPE_PROPERTY_OBJECT_VALUE_MALFORMED:
			"The object values of the 'shape' property must be of type Plain Object.",
		NATURE_PROPERTY_MALFORMED:
			"The 'nature' property must be of type Boolean.",
		NATURE_PROPERTY_STRING_MISCONFIGURED:
			"The string of the 'nature' property must be of set on 'LIKE', 'BASIC' or 'PLAIN'.",
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
	NETURE: ["LIKE", "BASIC", "PLAIN"],
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
		return (isPlainObject(obj) && (!("type" in obj) || typeof obj.type !== "string"));
	},
	mount(chunk, criteria) {
		const { shape, nature, omittable, expandable } = criteria;

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
		if (nature !== undefined) {
			if (typeof nature !== "string") {
				return ("NATURE_PROPERTY_MALFORMED");
			}
			if (!this.NETURE.includes(nature)) {
				return ("NATURE_PROPERTY_STRING_MISCONFIGURED");
			}
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
			} else if (typeof expandable !== "boolean") {
				return ("EXPANDABLE_PROPERTY_MALFORMED");
			}
		}

		const resolvedOmittable = omittable ?? false;
		const resolvedExpandable = expandable ?? false;
		const declaredKeyArray = Reflect.ownKeys(shape);
		const unforcedKeyArray = this.getUnforcedKeys(resolvedOmittable, declaredKeyArray);
		const enforcedKeyArray = this.getEnforcedKeys(resolvedOmittable, declaredKeyArray);

		Object.assign(criteria, {
			nature: nature ?? "BASIC",
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
		const {
			shape, nature, expandable,
			declaredKeySet, unforcedKeySet, enforcedKeySet
		} = criteria;

		if (nature) {
			if 
		}
		switch(criteria.nature) {
			case "LIKE":
				if (!isObjectLike(data)) {
					return ("TYPE_OBJECT_LIKE_UNSATISFIED");
				}
				break;
			case "PURE":
				if (!isObject(data)) {
					return ("TYPE_OBJECT_UNSATISFIED");
				}
				break;
			case "PLAIN":
				if (!isPlainObject(data)) {
					return ("TYPE_PLAIN_OBJECT_UNSATISFIED");
				}
				break;
		}
		if (criteria.nature) {
			if (!isPlainObject(data)) {
				return ("TYPE_PLAIN_OBJECT_UNSATISFIED");
			}
		} else if (!isObject(data)) {
			return ("TYPE_OBJECT_UNSATISFIED");
		}

		

		const declaredKeyCount = declaredKeySet.size;
		const enforcedKeyCount = enforcedKeySet.size;

		const definedKeyArray = Reflect.ownKeys(data);
		const definedKeyCount = definedKeyArray.length;
		
		if (definedKeyCount < enforcedKeyCount) {
			return ("SHAPE_UNSATISFIED");
		}
		if (!expandable && definedKeyCount > declaredKeyCount) {
			return ("EXPANDLABLE_UNALLOWED");
		}

		if (typeof expandable === "boolean") {
			let enforcedMiss = enforcedKeyCount;
			for (let i = 0; i < definedKeyCount; i++) {
				const key = definedKeyArray[i];

				if (enforcedKeySet.has(key)) {
					enforcedMiss--;
				}
				else if (enforcedMiss > i) {
					return ("SHAPE_UNSATISFIED");
				}
				else if (!unforcedKeySet.has(key)) {
					if (!expandable) {
						return ("EXPANDLABLE_UNALLOWED");
					}
					continue;
				}

				chunk.push({
					data: data[key],
					node: shape[key]
				});
			}
		} else {
			const expandedKeys: (string | symbol)[] = [];
			const { min, max } = expandable;

			let requiredMiss = enforcedKeyCount;
			for (let i = 0; i < definedKeyCount; i++) {
				const key = definedKeyArray[i];

				if (enforcedKeySet.has(key)) {
					requiredMiss--;
				}
				else if (requiredMiss > i) {
					return ("SHAPE_UNSATISFIED");
				}
				else if (!unforcedKeySet.has(key)) {
					expandedKeys.push(key);
					continue;
				}

				chunk.push({
					data: data[key],
					node: shape[key]
				});
			}

			if (min !== undefined && declaredKeyCount < min) {
				return ("EXPANDLABLE_MIN_UNSATISFIED");
			}
			if (max !== undefined && declaredKeyCount > max) {
				return ("EXPANDLABLE_MAX_UNSATISFIED");
			}

			if (expandable.key || expandable.value) {
				for (let i = 0; i < expandedKeys.length; i++) {
					const key = expandedKeys[i];
					
					if (expandable.key) {
						chunk.push({
							data: key,
							node: expandable.key
						});
					}
					if (expandable.value) {
						chunk.push({
							data: data[key],
							node: expandable.value
						});
					}
				}
			}
		}

		return (null);
	}
}