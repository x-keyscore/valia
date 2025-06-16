import type { SetableTuple, TupleSetableCriteria, } from "./types";
import type { Format } from "../types";
import { isArray } from "../../../testers";

function isShorthandTuple(obj: {}): obj is SetableTuple {
	return (isArray(obj));
}

export const TupleFormat: Format<TupleSetableCriteria> = {
	type: "tuple",
	mount(chunk, criteria) {
		const additional = criteria.additional ?? false;

		Object.assign(criteria, {
			additional: additional
		});

		for (let i = 0; i < criteria.tuple.length; i++) {
			let item = criteria.tuple[i];

			if (isShorthandTuple(item)) {
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
	},
	check(chunk, criteria, data) {
		if (!isArray(data)) {
			return ("TYPE.ARRAY.NOT_SATISFIED");
		}

		const { tuple, additional } = criteria;
		const dataLength = data.length,
			tupleLength = tuple.length;

		if (dataLength < tupleLength) {
			return ("TUPLE.ITEMS.NOT_SATISFIED");
		}
		else if (!additional && dataLength > tupleLength) {
			return ("TUPLE.ITEMS.NOT_SATISFIED");
		}

		for (let i = 0; i < tupleLength; i++) {
			chunk.push({
				data: data[i],
				node: tuple[i]
			});
		}

		if (dataLength > tupleLength && typeof additional !== "boolean") {
			chunk.push({
				data: data.slice(tupleLength),
				node: additional
			});
		}

		return (null);
	}
}