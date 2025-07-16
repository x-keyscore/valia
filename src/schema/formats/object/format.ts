import type { ObjectSetableCriteria, SetableShape, ObjectErrorCodes, ObjectRejectCodes, ObjectCustomMembers } from "./types";
import type { Format } from "../types";
import { isObject, isPlainObject, isArray } from "../../../testers";

export const ObjectFormat: Format<ObjectSetableCriteria, ObjectErrorCodes, ObjectRejectCodes, ObjectCustomMembers> = {
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
			"The 'extensible' property must be of type Boolean or a Plain Object.",
		EXPANDABLE__KEY_PROPERTY_MALFORMED:
			"The 'extensible.key' property, must be a criteria node of type Plain Object.",
		EXPANDABLE__KEY_PROPERTY_MISCONFIGURED:
			"The value of the 'extensible.key' property, must be a criteria node with a 'type' property equal to 'string' or 'symbol'",
		EXPANDABLE__VALUE_PROPERTY_MALFORMED:
			"The 'extensible.value' property, must be a criteria node Object.",
		EXPANDABLE__MIN_PROPERTY_MALFORMED:
			"The 'extensible.min' property, must be of type Number.",
		EXPANDABLE__MAX_PROPERTY_MALFORMED:
			"The 'extensible.max' property, must be of type Number.",
		EXPANDABLE__MIN_AND_MAX_PROPERTIES_MISCONFIGURED:
			"The 'extensible.min' property cannot be greater than 'extensible.max' property."
	},
	getUnforcedKeys(omittable, declaredKeys) {
		if (omittable === true) return (declaredKeys);
		if (omittable === false) return ([]);

		return (declaredKeys.filter(key => omittable.includes(key)));
	},
	getEnforcedKeys(omittable, declaredKeys) {
		if (omittable === true) return ([]);
		if (omittable === false) return (declaredKeys);

		return (declaredKeys.filter(key => !omittable.includes(key)));
	},
	isShorthandShape(obj): obj is SetableShape {
		return (isPlainObject(obj) && (!("type" in obj) || typeof obj.type !== "string"));
	},
	mount(chunk, criteria) {
		const { shape, strict, omittable, extensible } = criteria;

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
		if (extensible !== undefined) {
			if (isPlainObject(extensible)) {
				const { key, value, min, max } = extensible;

				if (isPlainObject(key)) {
					if (key.type !== "string" && key.type !== "symbol") {
						return ("EXPANDABLE__KEY_PROPERTY_MISCONFIGURED");
					}
				} else if (key !== undefined) {
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
			} else if (typeof extensible !== "boolean") {
				return ("EXPANDABLE_PROPERTY_MALFORMED");
			}
		}

		const resolvedOmittable = omittable ?? false;
		const resolvedExtensible = extensible ?? false;
		const declaredKeyArray = Reflect.ownKeys(shape);
		const unforcedKeyArray = this.getUnforcedKeys(resolvedOmittable, declaredKeyArray);
		const enforcedKeyArray = this.getEnforcedKeys(resolvedOmittable, declaredKeyArray);

		Object.assign(criteria, {
			strict: strict ?? true,
			omittable: resolvedOmittable,
			extensible: resolvedExtensible,
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
				partPath: {
					explicit: ["shape", key],
					implicit: ["&", key]
				}
			});
		}

		if (isPlainObject(resolvedExtensible)) {
			if (resolvedExtensible.key) {
				chunk.push({
					node: resolvedExtensible.key,
					partPath: {
						explicit: ["extensible", "key"]
					}
				});
			}
			if (resolvedExtensible.value) {
				chunk.push({
					node: resolvedExtensible.value,
					partPath: {
						explicit: ["extensible", "value"],
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
			shape, extensible,
			declaredKeySet, unforcedKeySet, enforcedKeySet
		} = criteria;

		const declaredKeyCount = declaredKeySet.size;
		const enforcedKeyCount = enforcedKeySet.size;

		const definedKeyArray = Reflect.ownKeys(data);
		const definedKeyCount = definedKeyArray.length;

		if (definedKeyCount < enforcedKeyCount) {
			return ("SHAPE_UNSATISFIED");
		}
		if (!extensible && definedKeyCount > declaredKeyCount) {
			return ("EXTENSIBLE_UNALLOWED");
		}

		if (typeof extensible === "boolean") {
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
					if (!extensible) {
						return ("EXTENSIBLE_UNALLOWED");
					}
					continue;
				}

				chunk.push({
					data: data[key],
					node: shape[key]
				});
			}
		} else {
			const extendedKeyArray: (string | symbol)[] = [];
			const { min, max } = extensible;

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
					extendedKeyArray.push(key);
					continue;
				}

				chunk.push({
					data: data[key],
					node: shape[key]
				});
			}

			const extendedKeyCount = extendedKeyArray.length;

			if (min !== undefined && extendedKeyCount < min) {
				return ("EXTENSIBLE_MIN_UNSATISFIED");
			}
			if (max !== undefined && extendedKeyCount > max) {
				return ("EXTENSIBLE_MAX_UNSATISFIED");
			}
			if (extendedKeyCount && (extensible.key || extensible.value)) {
				for (let i = 0; i < extendedKeyCount; i++) {
					const key = extendedKeyArray[i];
					
					if (extensible.key) {
						chunk.push({
							data: key,
							node: extensible.key
						});
					}
					if (extensible.value) {
						chunk.push({
							data: data[key],
							node: extensible.value
						});
					}
				}
			}
		}

		return (null);
	}
}