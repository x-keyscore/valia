import type { ArraySetableCriteria, SetableShape, ArrayErrors, ArrayRejects, ArrayMembers } from "./types";
import type { Format } from "../types";
import { isPlainObject, isArray } from "../../../testers";

export const ArrayFormat: Format<ArraySetableCriteria, ArrayErrors, ArrayRejects, ArrayMembers> = {
	type: "array",
	errors: {
		SHAPE_PROPERTY_REQUIRED:
            "The 'shape' property is required.",
        SHAPE_PROPERTY_MALFORMED:
			"The 'shape' property must be of type Array.",
		SHAPE_PROPERTY_ARRAY_ITEM_MALFORMED:
            "The array items of the 'shape' property must be of type Plain Object or Array.",
		EXPANDABLE_PROPERTY_MALFORMED:
			"The 'expandable' property must be of type Boolean or a Plain Object.",
		EXPANDABLE__ITEM_PROPERTY_MALFORMED:
			"The 'expandable.item' property, must be a criteria node Object.",
		EXPANDABLE__MIN_PROPERTY_MALFORMED:
			"The 'expandable.min' property, must be of type Number.",
		EXPANDABLE__MAX_PROPERTY_MALFORMED:
			"The 'expandable.max' property, must be of type Number.",
		EXPANDABLE__MIN_AND_MAX_PROPERTIES_MISCONFIGURED:
			"The 'expandable.min' property cannot be greater than 'expandable.max' property."
	},
	isShorthandShape(obj): obj is SetableShape {
		return (isArray(obj));
	},
	mount(chunk, criteria) {
		const { shape, expandable } = criteria;

		if (!("shape" in criteria)) {
			return ("SHAPE_PROPERTY_REQUIRED");
		}
		if (!isArray(shape)) {
			return ("SHAPE_PROPERTY_MALFORMED");
		}
		for (const item of shape) {
			if (!isPlainObject(item)) {
				return ("SHAPE_PROPERTY_ARRAY_ITEM_MALFORMED");
			}
		}
		if (expandable !== undefined) {
			if (isPlainObject(expandable)) {
				const { item, min, max } = expandable;

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
			} else if (typeof expandable !== "boolean") {
				return ("EXPANDABLE_PROPERTY_MALFORMED");
			}
		}

		const resolvedExpandable = expandable ?? false;

		Object.assign(criteria, {
			expandable: resolvedExpandable
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
				partPaths: {
					explicit: ["tuple", i],
					implicit: ["&", i]
				}
			});
		}

		if (typeof resolvedExpandable === "object") {
			if (resolvedExpandable.item) {
				chunk.push({
					node: resolvedExpandable.item,
					partPaths: {
						explicit: ["expandable", "item"],
						implicit: []
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

		const { shape, expandable } = criteria;
		const declaredLength = shape.length;
		const definedLength = data.length;

		if (definedLength < declaredLength) {
			return ("SHAPE_UNSATISFIED");
		}
		if (!expandable && definedLength > declaredLength) {
			return ("EXPANDLABLE_UNALLOWED");
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

		if (typeof expandable === "object") {
			const expandedLength = declaredLength - declaredLength;
			const { min, max } = expandable;

			if (min !== undefined && expandedLength < min) {
				return ("EXPANDLABLE_MIN_UNSATISFIED");
			}
			if (max !== undefined && expandedLength > max) {
				return ("EXPANDLABLE_MAX_UNSATISFIED");
			}

			if (expandable.item) {
				for (let i = declaredLength; i < definedLength; i++) {
					chunk.push({
						data: data[i],
						node: expandable.item
					});
				}
			}
		}

		return (null);
	}
}