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
	isShorthandShape(obj: {}): obj is SetableShape {
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
				return ("TUPLE_PROPERTY_ARRAY_ITEM_MALFORMED");
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

		const additional = criteria.additional ?? false;

		Object.assign(criteria, {
			additional: additional
		});

		for (let i = 0; i < criteria.tuple.length; i++) {
			let item = criteria.tuple[i];

			if (this.isShorthandShape(item)) {
				item = {
					type: "tuple",
					tuple: item
				}
				criteria.tuple[i] = item;
			}

			chunk.push({
				node: item,
				partPaths: {
					explicit: ["tuple", i],
					implicit: ["&", i]
				}
			});
		}

		if (typeof additional !== "boolean") {
			chunk.push({
				node: additional,
				partPaths: {
					explicit: ["additional"],
					implicit: []
				}
			});
		}

		return (null);
	},
	check(chunk, criteria, data) {
		if (!isArray(data)) {
			return ("TYPE_ARRAY_UNSATISFIED");
		}

		const { tuple, additional } = criteria;
		const tupleLength = tuple.length;
		const dataLength = data.length;

		if (dataLength < tupleLength) {
			return ("TUPLE_UNSATISFIED");
		}

		for (let i = 0; i < tupleLength; i++) {
			chunk.push({
				data: data[i],
				node: tuple[i]
			});
		}

		if (dataLength > tupleLength && !additional) {
			return ("ADDITIONAL_UNALLOWED");
		}
		if (dataLength > tupleLength && typeof additional === "object") {
			const additionalItems = data.slice(tupleLength);

			chunk.push({
				data: additionalItems,
				node: additional
			});
		}

		return (null);
	}
}