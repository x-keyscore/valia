import type { SetableTuple, TupleSetableCriteria, TupleErrors, TupleRejects, TupleMembers } from "./types";
import type { Format } from "../types";
import { isPlainObject, isArray } from "../../../testers";

export const TupleFormat: Format<TupleSetableCriteria, TupleErrors, TupleRejects, TupleMembers> = {
	type: "tuple",
	errors: {
		TUPLE_PROPERTY_REQUIRED:
            "The 'typle' property is required.",
        TUPLE_PROPERTY_MALFORMED:
			"The 'tuple' property must be of type Array.",
		TUPLE_PROPERTY_ARRAY_ITEM_MALFORMED:
            "The array items of the 'tuple' property must be of type Plain Object or Array.",
        ADDITIONAL_PROPERTY_MALFORMED:
            "The 'additional' property must be of type Boolean or a Plain Object.",
        ADDITIONAL_PROPERTY_OBJECT_MISCONFIGURED:
            "The object of the 'additional' property, must be a 'array’ criteria node."
	},
	isShorthandTuple(obj: {}): obj is SetableTuple {
		return (isArray(obj));
	},
	mount(chunk, criteria) {
		if (!("tuple" in criteria)) {
			return ("TUPLE_PROPERTY_REQUIRED");
		}
		if (!isArray(criteria.tuple)) {
			return ("TUPLE_PROPERTY_MALFORMED");
		}
		for (const item of criteria.tuple) {
			if (!isPlainObject(item) && !isArray(item)) {
				return ("TUPLE_PROPERTY_ARRAY_ITEM_MALFORMED");
			}
		}
		if (criteria.additional !== undefined) {
			if (isPlainObject(criteria.additional)) {
				if (criteria.additional?.type !== "array") {
					return ("ADDITIONAL_PROPERTY_OBJECT_MISCONFIGURED");
				}
			} else if (typeof criteria.additional !== "boolean") {
				return ("ADDITIONAL_PROPERTY_MALFORMED")
			}
		}

		const additional = criteria.additional ?? false;

		Object.assign(criteria, {
			additional: additional
		});

		for (let i = 0; i < criteria.tuple.length; i++) {
			let item = criteria.tuple[i];

			if (this.isShorthandTuple(item)) {
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