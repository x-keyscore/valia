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
		SHAPE_PROPERTY_MALFORMED:
			"The 'shape' property must be of type Plain Object.",
		SHAPE_PROPERTY_OBJECT_VALUE_MALFORMED:
			"The object values of the 'shape' property must be of type Plain Object.",
		NATURE_PROPERTY_MALFORMED:
			"The 'nature' property must be of type String.",
		NATURE_PROPERTY_STRING_MISCONFIGURED:
			"The 'nature' property must be a known string.",
		OPTIONAL_PROPERTY_MALFORMED:
			"The 'optional' property must be of type Boolean or Array.",
		OPTIONAL_PROPERTY_ARRAY_ITEM_MALFORMED:
			"The array items of the 'optional' property must be of type String or Symbol.",
		OPTIONAL_PROPERTY_WITHOUT_SHAPE_PROPERTY_DEFINED:
			"The 'optional' property cannot be defined without the 'shape' property.",
		ADDITIONAL_PROPERTY_MALFORMED:
			"The 'additional' property must be of type Boolean or a Plain Object.",
		ADDITIONAL_PROPERTY_WITHOUT_SHAPE_PROPERTY_DEFINED:
			"The 'additional' property cannot be defined without the 'shape' property.",
		ADDITIONAL__KEY_PROPERTY_MALFORMED:
			"The 'additional.key' property, must be a criteria node of type Plain Object.",
		ADDITIONAL__KEY_PROPERTY_MISCONFIGURED:
			"The value of the 'additional.key' property, must be a criteria node with a 'type' property equal to 'string' or 'symbol'",
		ADDITIONAL__VALUE_PROPERTY_MALFORMED:
			"The 'additional.value' property, must be a criteria node Object.",
		ADDITIONAL__MIN_PROPERTY_MALFORMED:
			"The 'additional.min' property, must be of type Number.",
		ADDITIONAL__MAX_PROPERTY_MALFORMED:
			"The 'additional.max' property, must be of type Number.",
		ADDITIONAL__MIN_AND_MAX_PROPERTIES_MISCONFIGURED:
			"The 'additional.min' property cannot be greater than 'additional.max' property."
	},
	natures: ["STANDARD", "PLAIN"],
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
		const { shape, nature, optional, additional } = criteria;

		if (shape !== undefined) {
			if (!isPlainObject(shape)) {
				return ("SHAPE_PROPERTY_MALFORMED");
			}
			for (const key of Reflect.ownKeys(shape)) {
				if (!isPlainObject(shape[key])) {
					return ("SHAPE_PROPERTY_OBJECT_VALUE_MALFORMED");
				}
			}
		}
		if (nature !== undefined) {
			if (typeof nature !== "string") {
				return ("NATURE_PROPERTY_MALFORMED");
			}
			if (!this.natures.includes(nature)) {
				return ("NATURE_PROPERTY_STRING_MISCONFIGURED");
			}
		}
		if (optional !== undefined) {
			if (!("shape" in criteria)) {
				return ("OPTIONAL_PROPERTY_WITHOUT_SHAPE_PROPERTY_DEFINED");
			}

			if (isArray(optional)) {
				for (const item of optional) {
					if (typeof item !== "string" && typeof item !== "symbol") {
						return ("OPTIONAL_PROPERTY_ARRAY_ITEM_MALFORMED");
					}
				}
			} else if (typeof optional !== "boolean") {
				return ("OPTIONAL_PROPERTY_MALFORMED");
			}
		}
		if (additional !== undefined) {
			if (!("shape" in criteria)) {
				return ("ADDITIONAL_PROPERTY_WITHOUT_SHAPE_PROPERTY_DEFINED");
			}

			if (isPlainObject(additional)) {
				const { key, value, min, max } = additional;

				if (isPlainObject(key)) {
					if (key.type !== "string" && key.type !== "symbol") {
						return ("ADDITIONAL__KEY_PROPERTY_MISCONFIGURED");
					}
				} else if (key !== undefined) {
					return ("ADDITIONAL__KEY_PROPERTY_MALFORMED");
				}
				if (value !== undefined && !isPlainObject(value)) {
					return ("ADDITIONAL__VALUE_PROPERTY_MALFORMED");
				}
				if (min !== undefined && typeof min !== "number") {
					return ("ADDITIONAL__MIN_PROPERTY_MALFORMED");
				}
				if (max !== undefined && typeof max !== "number") {
					return ("ADDITIONAL__MAX_PROPERTY_MALFORMED");
				}
				if (min !== undefined && max !== undefined && min > max) {
					return ("ADDITIONAL__MIN_AND_MAX_PROPERTIES_MISCONFIGURED");
				}
			} else if (typeof additional !== "boolean") {
				return ("ADDITIONAL_PROPERTY_MALFORMED");
			}
		}

		const resolvedOptional = optional ?? false;
		const resolvedAdditional = additional ?? false;

		Object.assign(criteria, {
			nature: nature ?? "STANDARD",
			optional: resolvedOptional,
			additional: resolvedAdditional
		});

		if (shape === undefined) return (null);

		const declaredKeyArray = Reflect.ownKeys(shape);
		const unforcedKeyArray = this.getUnforcedKeys(resolvedOptional, declaredKeyArray);
		const enforcedKeyArray = this.getEnforcedKeys(resolvedOptional, declaredKeyArray);

		Object.assign(criteria, {
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

		if (isPlainObject(resolvedAdditional)) {
			if (resolvedAdditional.key) {
				chunk.push({
					node: resolvedAdditional.key,
					partPath: {
						explicit: ["additional", "key"]
					}
				});
			}
			if (resolvedAdditional.value) {
				chunk.push({
					node: resolvedAdditional.value,
					partPath: {
						explicit: ["additional", "value"],
						implicit: ["%", "string", "symbol"]
					}
				});
			}
		}
		

		return (null);
	},
	check(chunk, criteria, data) {
		if (criteria.nature === "STANDARD") {
			if (!isObject(data)) {
				return ("TYPE_OBJECT_UNSATISFIED");
			}
		} else if (!isPlainObject(data)) {
			return ("TYPE_PLAIN_OBJECT_UNSATISFIED");
		}

		const {
			shape, additional,
			declaredKeySet, unforcedKeySet, enforcedKeySet
		} = criteria;

		if (shape === undefined) return (null);

		const declaredKeyCount = declaredKeySet!.size;
		const enforcedKeyCount = enforcedKeySet!.size;

		const definedKeyArray = Reflect.ownKeys(data);
		const definedKeyCount = definedKeyArray.length;

		if (definedKeyCount < enforcedKeyCount) {
			return ("SHAPE_UNSATISFIED");
		}
		if (!additional && definedKeyCount > declaredKeyCount) {
			return ("EXTENSIBLE_UNALLOWED");
		}

		if (typeof additional === "boolean") {
			let enforcedMiss = enforcedKeyCount;
			for (let i = 0; i < definedKeyCount; i++) {
				const key = definedKeyArray[i];

				if (enforcedKeySet!.has(key)) {
					enforcedMiss--;
				}
				else if (enforcedMiss > i) {
					return ("SHAPE_UNSATISFIED");
				}
				else if (!unforcedKeySet!.has(key)) {
					if (!additional) {
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
			const { min, max } = additional;

			let enforcedMiss = enforcedKeyCount;
			for (let i = 0; i < definedKeyCount; i++) {
				const key = definedKeyArray[i];

				if (enforcedKeySet!.has(key)) {
					enforcedMiss--;
				}
				else if (enforcedMiss > i) {
					return ("SHAPE_UNSATISFIED");
				}
				else if (!unforcedKeySet!.has(key)) {
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
			if (extendedKeyCount && (additional.key || additional.value)) {
				for (let i = 0; i < extendedKeyCount; i++) {
					const key = extendedKeyArray[i];

					if (additional.key) {
						chunk.push({
							data: key,
							node: additional.key
						});
					}
					if (additional.value) {
						chunk.push({
							data: data[key],
							node: additional.value
						});
					}
				}
			}
		}

		return (null);
	}
}