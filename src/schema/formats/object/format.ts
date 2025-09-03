import type { ObjectSetableCriteria, SetableShape, ObjectExceptionCodes, ObjectRejectionCodes, ObjectCustomMembers } from "./types";
import type { Format } from "../types";
import { isObject, isPlainObject, isArray } from "../../../testers";

export const ObjectFormat: Format<
	ObjectSetableCriteria,
	ObjectExceptionCodes,
	ObjectRejectionCodes,
	ObjectCustomMembers
> = {
	type: "object",
	exceptions: {
		NATURE_PROPERTY_MISDECLARED:
			"The 'nature' property must be of type string.",
		NATURE_PROPERTY_MISCONFIGURED:
			"The 'nature' property must be a known string.",
		MIN_PROPERTY_MISDECLARED:
			"The 'min' property must be of type number.",
		MAX_PROPERTY_MISDECLARED:
			"The 'max' property must be of type number.",
		MAX_MIN_PROPERTIES_MISCONFIGURED:
			"The 'max' property cannot be less than 'min' property.",
		SHAPE_PROPERTY_MISDECLARED:
			"The 'shape' property must be of type plain object.",
		SHAPE_PROPERTY_OBJECT_VALUE_MISDECLARED:
			"The object values of the 'shape' property must be of type plain object.",
		SHAPE_MIN_PROPERTIES_MISCONFIGURED:
			"The object of the 'shape' property must have a number of properties less than the 'min' property.",
		SHAPE_MAX_PROPERTIES_MISCONFIGURED:
			"The object of the 'shape' property must have a number of properties less than the 'max' property.",
		SHAPE_MIN_MAX_PROPERTIES_KEYS_VALUES_PROPERTIES_UNDEFINED:
			"The 'shape' property with the 'min' property or/and 'max' property cannot be defined without the 'keys' property or 'values' property.",
		OPTIONAL_PROPERTY_MISDECLARED:
			"The 'optional' property must be of type boolean or array.",
		OPTIONAL_PROPERTY_ARRAY_ITEM_MISDECLARED:
			"The array items of the 'optional' property must be of type string or symbol.",
		OPTIONAL_PROPERTY_SHAPE_PROPERTY_UNDEFINED:
			"The 'optional' property cannot be defined without the 'shape' property.",
		KEYS_PROPERTY_MISDECLARED:
			"The 'keys' property must be of type plain object.",
		KEYS_PROPERTY_OBJECT_TYPE_PROPERTY_UNDEFINED:
			"The object's 'type' property of the 'keys' property must be defined.",
		KEYS_PROPERTY_OBJECT_TYPE_PROPERTY_MISDECLARED:
			"The object's 'type' property of the 'keys' property must be of type string.",
		KEYS_PROPERTY_OBJECT_TYPE_PROPERTY_MISCONFIGURED:
			"The object's 'type' property of the 'keys' property must be 'string' or 'symbol'.",
		VALUES_PROPERTY_MISDECLARED:
			"The 'values' property must be of type plain object."
	},
	natures: ["PLAIN"],
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
		const { nature, min, max, shape, optional, keys, values } = criteria;
		const resolvedOptional = optional ?? false;

		if (nature !== undefined) {
			if (typeof nature !== "string") {
				return ("NATURE_PROPERTY_MISDECLARED");
			}
			if (!this.natures.includes(nature)) {
				return ("NATURE_PROPERTY_MISCONFIGURED");
			}
		}
		if (min !== undefined && typeof min !== "number") {
			return ("MIN_PROPERTY_MISDECLARED");
		}
		if (max !== undefined && typeof max !== "number") {
			return ("MAX_PROPERTY_MISDECLARED");
		}
		if (min !== undefined && max !== undefined && min > max) {
			return ("MAX_MIN_PROPERTIES_MISCONFIGURED");
		}
		if (shape !== undefined) {
			if (!isPlainObject(shape)) {
				return ("SHAPE_PROPERTY_MISDECLARED");
			}
			if (
				(min !== undefined || max !== undefined)
				&& !("keys" in criteria)
				&& !("values" in criteria)
			) {
				return ("SHAPE_MIN_MAX_PROPERTIES_KEYS_VALUES_PROPERTIES_UNDEFINED");
			}

			const shapeKeys = Reflect.ownKeys(shape);
			const shapeKeysLength = shapeKeys.length;

			if (min !== undefined &&  min < shapeKeysLength) {
				return ("SHAPE_MIN_PROPERTIES_MISCONFIGURED");
			}
			if (max !== undefined &&  max < shapeKeysLength) {
				return ("SHAPE_MAX_PROPERTIES_MISCONFIGURED");
			}

			for (let i = 0; i < shapeKeysLength; i++) {
				const key = shapeKeys[i];
				let node = shape[key];

				if (!isPlainObject(node)) {
					return ("SHAPE_PROPERTY_OBJECT_VALUE_MISDECLARED");
				}

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

			Object.assign(criteria, {
				declaredKeySet: new Set(shapeKeys),
				unforcedKeySet: new Set(this.getUnforcedKeys(resolvedOptional, shapeKeys)),
				enforcedKeySet: new Set(this.getEnforcedKeys(resolvedOptional, shapeKeys))
			});
		}
		if (optional !== undefined) {
			if (isArray(optional)) {
				for (const item of optional) {
					if (typeof item !== "string" && typeof item !== "symbol") {
						return ("OPTIONAL_PROPERTY_ARRAY_ITEM_MISDECLARED");
					}
				}
			}
			else if (typeof optional !== "boolean") {
				return ("OPTIONAL_PROPERTY_MISDECLARED");
			}

			if (shape === undefined) {
				return ("OPTIONAL_PROPERTY_SHAPE_PROPERTY_UNDEFINED");
			}

			Object.assign(criteria, {
				optional: resolvedOptional
			});
		}
		if (keys !== undefined) {
			if (!isPlainObject(keys)) {
				return ("KEYS_PROPERTY_MISDECLARED");
			}
			if (!("type" in keys)) {
				return ("KEYS_PROPERTY_OBJECT_TYPE_PROPERTY_UNDEFINED");
			}
			if (typeof keys.type !== "string") {
				return ("KEYS_PROPERTY_OBJECT_TYPE_PROPERTY_MISDECLARED");
			}
			if (keys.type !== "string" && keys.type !== "symbol") {
				return ("KEYS_PROPERTY_OBJECT_TYPE_PROPERTY_MISCONFIGURED");
			}

			chunk.push({
				node: keys,
				partPath: {
					explicit: ["keys"],
					implicit: []
				}
			});
		}
		if (values !== undefined) {
			if (!isPlainObject(values)) {
				return ("VALUES_PROPERTY_MISDECLARED");
			}

			chunk.push({
				node: values,
				partPath: {
					explicit: ["values"],
					implicit: ["%", "string", "symbol"]
				}
			});
		}

		return (null);
	},
	check(chunk, criteria, data) {
		if (!isObject(data)) {
			return ("TYPE_OBJECT_UNSATISFIED");
		}

		const {
			nature, min, max, shape, keys, values,
			declaredKeySet, unforcedKeySet, enforcedKeySet
		} = criteria;

		if (nature === "PLAIN" && !isPlainObject(data)) {
			return ("NATURE_PLAIN_UNSATISFIED");
		}

		const definedKeyArray = Reflect.ownKeys(data);
		const definedKeyCount = definedKeyArray.length;

		if (min !== undefined && definedKeyCount < min) {
			return ("MIN_UNSATISFIED");
		}
		if (max !== undefined && definedKeyCount > max) {
			return ("MAX_UNSATISFIED");
		}
		if (shape !== undefined) {
			const declaredKeyCount = declaredKeySet!.size;
			const enforcedKeyCount = enforcedKeySet!.size;

			if (definedKeyCount < enforcedKeyCount) {
				return ("SHAPE_UNSATISFIED");
			}

			if (keys === undefined && values === undefined) {
				if (definedKeyCount > declaredKeyCount) {
					return ("SHAPE_UNSATISFIED");
				}

				let enforcedMissing = enforcedKeyCount;
				for (let i = definedKeyCount - 1; i >= 0; i--) {
					const key = definedKeyArray[i];

					if (enforcedKeySet!.has(key)) {
						enforcedMissing--;
					}
					else if (enforcedMissing > i) {
						return ("SHAPE_UNSATISFIED");
					}
					else if (!unforcedKeySet!.has(key)) {
						return ("SHAPE_UNSATISFIED");
					}

					chunk.push({
						data: data[key],
						node: shape[key]
					});
				}
			} else {
				let enforcedMissing = enforcedKeyCount;
				for (let i = definedKeyCount - 1; i >= 0; i--) {
					const key = definedKeyArray[i];

					if (enforcedKeySet!.has(key)) {
						enforcedMissing--;
					}
					else if (enforcedMissing > i) {
						return ("SHAPE_UNSATISFIED");
					}
					else if (!unforcedKeySet!.has(key)) {
						if (keys !== undefined) {
							chunk.push({
								data: key,
								node: keys
							});
						}
						if (values !== undefined) {
							chunk.push({
								data: data[key],
								node: values
							});
						}
						continue;
					}

					chunk.push({
						data: data[key],
						node: shape[key]
					});
				}
			}
		}
		if (shape === undefined && keys !== undefined) {
			for (let i = 0; i < definedKeyCount; i++) {
				const key = definedKeyArray[i];

				chunk.push({
					data: key,
					node: keys
				});
			}
		}
		if (shape === undefined && values !== undefined) {
			for (let i = 0; i < definedKeyCount; i++) {
				const key = definedKeyArray[i];

				chunk.push({
					data: data[key],
					node: values
				});
			}
		}

		return (null);
	}
}