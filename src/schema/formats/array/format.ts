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
		MIN_PROPERTY_MALFORMED:
			"The 'min' property must be of type number.",
		MAX_PROPERTY_MALFORMED:
			"The 'max' property must be of type number.",
		MAX_MIN_PROPERTIES_MISCONFIGURED:
			"The 'max' property cannot be less than 'min' property.",
		TUPLE_PROPERTY_MALFORMED:
			"The 'tuple' property must be of type array.",
		TUPLE_MIN_PROPERTIES_MISCONFIGURED:
			"The array length of the 'tuple' property cannot be less than 'min' property.",
		TUPLE_PROPERTY_ARRAY_ITEM_MALFORMED:
			"The array items of the 'tuple' property must be of type plain-object or array.",
		MAX_MIN_PROPERTIES_ITEM_PROPERTY_REQUIRED:
			"The 'items' property must be set to use the 'min' and 'max' properties",
		ITEMS_PROPERTY_MALFORMED:
			"The 'items' property must be of type of object or boolean."
	},
	isShorthandTuple(obj): obj is SetableShape {
		return (isArray(obj));
	},
	mount(chunk, criteria) {
		const { min, max, tuple, items } = criteria;

		if (min !== undefined && typeof min !== "number") {
			return ("MAX_PROPERTY_MALFORMED");
		}
		if (max !== undefined && typeof max !== "number") {
			return ("MAX_PROPERTY_MALFORMED");
		}
		if (min !== undefined && max !== undefined && min > max) {
			return ("MIN_MAX_PROPERTIES_MISCONFIGURED");
		}
		if (items !== undefined) {
			if (isPlainObject(items)) {
				chunk.push({
					node: items,
					partPath: {
						explicit: ["items"],
						implicit: ["%", "number"]
					}
				});
			}
			else if (typeof items !== "boolean") {
				return ("ITEMS_PROPERTY_MALFORMED");
			}
		}
		if (tuple !== undefined) {
			if (!isArray(tuple)) {
				return ("TUPLE_PROPERTY_MALFORMED");
			}

			for (let i = 0; i < tuple.length; i++) {
				let node = tuple[i];

				if (!isPlainObject(node) && !isArray(node)) {
					return ("TUPLE_PROPERTY_ARRAY_ITEM_MALFORMED");
				}

				if (this.isShorthandTuple(node)) {
					node = {
						type: "array",
						tuple: node
					}
					tuple[i] = node;
				}

				chunk.push({
					node: node,
					partPath: {
						explicit: ["shape", i],
						implicit: ["&", i]
					}
				});
			}
		}

		Object.assign(criteria, {
			items: items ?? false
		});

		return (null);
	},
	check(chunk, criteria, data) {
		if (!isArray(data)) {
			return ("TYPE_ARRAY_UNSATISFIED");
		}

		const { min, max, tuple, items } = criteria;
		const declaredLength = tuple?.length ?? 0;
		const definedLength = data.length;

		if (min !== undefined && definedLength < min) {
			return ("MIN_UNSATISFIED");
		}
		if (max !== undefined && definedLength > max) {
			return ("MAX_UNSATISFIED");
		}
		if (definedLength < declaredLength) {
			return ("SHAPE_UNSATISFIED");
		}
		if (!items && definedLength > declaredLength) {
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

		if (typeof items === "object") {
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