import type { ArraySetableCriteria, SetableShape, ArrayErrorCodes, ArrayRejectCodes, ArrayCustomMembers } from "./types";
import type { Format } from "../types";
import { isPlainObject, isArray } from "../../../testers";

export const ArrayFormat: Format<ArraySetableCriteria, ArrayErrorCodes, ArrayRejectCodes, ArrayCustomMembers> = {
	type: "array",
	errors: {
		SHAPE_PROPERTY_REQUIRED:
            "The 'shape' property is required.",
        SHAPE_PROPERTY_MALFORMED:
			"The 'shape' property must be of type Array.",
		SHAPE_PROPERTY_ARRAY_ITEM_MALFORMED:
            "The array items of the 'shape' property must be of type Plain Object or Array.",
		EXPANDABLE_PROPERTY_MALFORMED:
			"The 'extensible' property must be of type Boolean or a Plain Object.",
		EXPANDABLE__ITEM_PROPERTY_MALFORMED:
			"The 'extensible.item' property, must be a criteria node Object.",
		EXPANDABLE__MIN_PROPERTY_MALFORMED:
			"The 'extensible.min' property, must be of type Number.",
		EXPANDABLE__MAX_PROPERTY_MALFORMED:
			"The 'extensible.max' property, must be of type Number.",
		EXPANDABLE__MIN_AND_MAX_PROPERTIES_MISCONFIGURED:
			"The 'extensible.min' property cannot be greater than 'extensible.max' property."
	},
	isShorthandShape(obj): obj is SetableShape {
		return (isArray(obj));
	},
	mount(chunk, criteria) {
		const { shape, extensible } = criteria;

		if (!("shape" in criteria)) {
			return ("SHAPE_PROPERTY_REQUIRED");
		}
		if (!isArray(shape)) {
			return ("SHAPE_PROPERTY_MALFORMED");
		}
		for (const item of shape) {
			if (!isPlainObject(item) && !isArray(item)) {
				return ("SHAPE_PROPERTY_ARRAY_ITEM_MALFORMED");
			}
		}
		if (extensible !== undefined) {
			if (isPlainObject(extensible)) {
				const { item, min, max } = extensible;

				if (item !== undefined && !isPlainObject(item)) {
					return ("EXPANDABLE__ITEM_PROPERTY_MALFORMED");
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

		const resolvedExtensible = extensible ?? false;

		Object.assign(criteria, {
			extensible: resolvedExtensible
		});

		for (let i = 0; i < shape.length; i++) {
			let node = shape[i];

			if (this.isShorthandShape(node)) {
				node = {
					type: "array",
					shape: node
				}
				shape[i] = node;
			}

			chunk.push({
				node: node,
				partPath: {
					explicit: ["shape", i],
					implicit: ["&", i]
				}
			});
		}

		if (typeof resolvedExtensible === "object") {
			if (resolvedExtensible.item) {
				chunk.push({
					node: resolvedExtensible.item,
					partPath: {
						explicit: ["extensible", "item"]
					}
				});
			}
		}

		return (null);
	},
	check(chunk, criteria, data) {
		if (!isArray(data)) {
			return ("TYPE_ARRAY_UNSATISFIED");
		}

		const { shape, extensible } = criteria;
		const declaredLength = shape.length;
		const definedLength = data.length;

		if (definedLength < declaredLength) {
			return ("SHAPE_UNSATISFIED");
		}
		if (!extensible && definedLength > declaredLength) {
			return ("EXTENSIBLE_UNALLOWED");
		}

		for (let i = 0; i < declaredLength; i++) {
			chunk.push({
				data: data[i],
				node: shape[i]
			});
		}

		if (definedLength === declaredLength) {
			return (null);
		}

		if (typeof extensible === "object") {
			const extendedItemCount = definedLength - declaredLength;
			const { min, max } = extensible;

			if (min !== undefined && extendedItemCount < min) {
				return ("EXTENSIBLE_MIN_UNSATISFIED");
			}
			if (max !== undefined && extendedItemCount > max) {
				return ("EXTENSIBLE_MAX_UNSATISFIED");
			}

			if (extendedItemCount && extensible.item) {
				for (let i = declaredLength; i < definedLength; i++) {
					chunk.push({
						data: data[i],
						node: extensible.item
					});
				}
			}
		}

		return (null);
	}
}