import type { SetableTuple, TupleSetableCriteria, } from "./types";
import type { Format } from "../types";
import { isArray } from "../../../tests";

function isShorthandTuple(obj: {}): obj is SetableTuple {
	return (isArray(obj));
}

export const TupleFormat: Format<TupleSetableCriteria> = {
	type: "tuple",
	defaultCriteria: {
		empty: false
	},
	mount(chunk, criteria) {
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
	},
	check(chunk, criteria, data) {
		if (!isArray(data)) {
			return ("TYPE_ARRAY_REQUIRED");
		}

		const dataLength = data.length;

		if (dataLength < criteria.tuple.length) {
			return ("DATA_LENGTH_INFERIOR_MIN");
		}
		else if (dataLength > criteria.tuple.length) {
			return ("DATA_LENGTH_SUPERIOR_MAX");
		}

		for (let i = 0; i < dataLength; i++) {
			chunk.push({
				data: data[i],
				node: criteria.tuple[i]
			});
		}

		return (null);
	}
}