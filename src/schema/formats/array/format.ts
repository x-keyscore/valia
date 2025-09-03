import type { ArraySetableCriteria, SetableTuple, ArrayExceptionCodes, ArrayRejectionCodes, ArrayCustomMembers } from "./types";
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
		MIN_PROPERTY_MISDECLARED:
			"The 'min' property must be of type number.",
		MAX_PROPERTY_MISDECLARED:
			"The 'max' property must be of type number.",
		MIN_MAX_PROPERTIES_MISCONFIGURED:
			"The 'max' property cannot be less than 'min' property.",
		TUPLE_PROPERTY_MISDECLARED:
			"The 'tuple' property must be of type array.",
		TUPLE_PROPERTY_ARRAY_ITEM_MISDECLARED:
			"The array items of the 'tuple' property must be of type array or plain object.",
		TUPLE_MIN_PROPERTIES_MISCONFIGURED:
			"The array of the 'tuple' property must have a number of items less than the 'min' property.",
		TUPLE_MAX_PROPERTIES_MISCONFIGURED:
			"The array of the 'tuple' property must have a number of items less than the 'max' property.",
		TUPLE_MIN_MAX_PROPERTIES_ITEMS_PROPERTY_UNDEFINED:
			"The 'tuple' property with the 'min' property or/and 'max' property cannot be defined without the 'items' property.",
		ITEMS_PROPERTY_MISDECLARED:
			"The 'items' property must be of type object."
	},
	isShorthandTuple(obj): obj is SetableTuple {
		return (isArray(obj));
	},
	mount(chunk, criteria) {
		const { min, max, tuple, items } = criteria;

		if (min !== undefined && typeof min !== "number") {
			return ("MIN_PROPERTY_MISDECLARED");
		}
		if (max !== undefined && typeof max !== "number") {
			return ("MAX_PROPERTY_MISDECLARED");
		}
		if (min !== undefined && max !== undefined && min > max) {
			return ("MIN_MAX_PROPERTIES_MISCONFIGURED");
		}
		if (tuple !== undefined) {
			if (!isArray(tuple)) {
				return ("TUPLE_PROPERTY_MISDECLARED");
			}
			if ((min !== undefined || max !== undefined) && !("items" in criteria)) {
				return ("TUPLE_MIN_MAX_PROPERTIES_ITEMS_PROPERTY_UNDEFINED");
			}

			const tupleLength = tuple.length;

			if (min !== undefined && min < tupleLength) {
				return ("TUPLE_MIN_PROPERTIES_MISCONFIGURED");
			}
			if (max !== undefined && max < tupleLength) {
				return ("TUPLE_MAX_PROPERTIES_MISCONFIGURED");
			}

			for (let i = 0; i < tupleLength; i++) {
				let node = tuple[i];

				if (!isPlainObject(node) && !isArray(node)) {
					return ("TUPLE_PROPERTY_ARRAY_ITEM_MISDECLARED");
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
						explicit: ["tuple", i],
						implicit: ["&", i]
					}
				});
			}
		}
		if (items !== undefined) {
			if (!isPlainObject(items)) {
				return ("ITEMS_PROPERTY_MISDECLARED");
			}

			chunk.push({
				node: items,
				partPath: {
					explicit: ["items"],
					implicit: ["%", "number"]
				}
			});
		}

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
		if (tuple !== undefined) {
			if (definedLength < declaredLength) {
				return ("TUPLE_UNSATISFIED");
			}
			if (!items && definedLength > declaredLength) {
				return ("TUPLE_UNSATISFIED");
			}

			for (let i = 0; i < declaredLength; i++) {
				chunk.push({
					data: data[i],
					node: tuple[i]
				});
			}
		}
		if (items !== undefined) {
			if (declaredLength === definedLength || items.type === "unknown") {
				return (null);
			}

			for (let i = declaredLength; i < definedLength; i++) {
				chunk.push({
					data: data[i],
					node: items
				});
			}
		}

		return (null);
	}
}
