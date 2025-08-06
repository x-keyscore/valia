import type { ArraySetableCriteria, SetableShape, ArrayExceptionCodes, ArrayRejectionCodes, ArrayCustomMembers } from "./types";
import type { Format } from "../types";
import { isPlainObject, isArray } from "../../../testers";

export const ArrayFormat: Format<
	ArraySetableCriteria,
	ArrayExceptionCodes,
	ArrayRejectionCodes,
	ArrayCustomMembers
> = {
	type: "array",
	exceptions: {
        TUPLE_PROPERTY_MALFORMED:
			"The 'tuple' property must be of type array.",
		TUPLE_PROPERTY_ARRAY_ITEM_MALFORMED:
            "The array items of the 'tuple' property must be of type plain-object or array.",
		ADDITIONAL_PROPERTY_MALFORMED:
			"The 'additional' property must be of type Boolean or a plain-object.",
		ADDITIONAL__ITEM_PROPERTY_MALFORMED:
			"The 'additional.item' property, must be a criteria node object.",
		ADDITIONAL__MIN_PROPERTY_MALFORMED:
			"The 'additional.min' property, must be of type number.",
		ADDITIONAL__MAX_PROPERTY_MALFORMED:
			"The 'additional.max' property, must be of type number.",
		ADDITIONAL__MIN_AND_MAX_PROPERTIES_MISCONFIGURED:
			"The 'additional.min' property cannot be greater than 'additional.max' property."
	},
	isShorthandShape(obj): obj is SetableShape {
		return (isArray(obj));
	},
	mount(chunk, criteria) {
		const { tuple, items } = criteria;
		if (tuple !== undefined) {
			if (!isArray(tuple)) {
				return ("TUPLE_PROPERTY_MALFORMED");
			}
			for (const item of tuple) {
				if (!isPlainObject(item) && !isArray(item)) {
					return ("TUPLE_PROPERTY_ARRAY_ITEM_MALFORMED");
				}
			}
		}
		if (additional !== undefined) {
			if (isPlainObject(additional)) {
				const { item, min, max } = additional;

				if (item !== undefined && !isPlainObject(item)) {
					return ("ADDITIONAL__ITEM_PROPERTY_MALFORMED");
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

		const resolvedExtensible = additional ?? false;

		Object.assign(criteria, {
			additional: resolvedExtensible
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
						explicit: ["additional", "item"]
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

		const { shape, additional } = criteria;
		const declaredLength = shape.length;
		const definedLength = data.length;

		if (definedLength < declaredLength) {
			return ("SHAPE_UNSATISFIED");
		}
		if (!additional && definedLength > declaredLength) {
			return ("ADDITIONAL_UNALLOWED");
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

		if (typeof additional === "object") {
			const extendedItemCount = definedLength - declaredLength;
			const { min, max } = additional;

			if (min !== undefined && extendedItemCount < min) {
				return ("ADDITIONAL_MIN_UNSATISFIED");
			}
			if (max !== undefined && extendedItemCount > max) {
				return ("ADDITIONAL_MAX_UNSATISFIED");
			}

			if (extendedItemCount && additional.item) {
				for (let i = declaredLength; i < definedLength; i++) {
					chunk.push({
						data: data[i],
						node: additional.item
					});
				}
			}
		}

		return (null);
	}
}