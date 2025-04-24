import type { TupleSetableCriteria } from "./types";
import type { Format } from "../types";
import { isArray } from "../../../testers";

export const TupleFormat: Format<TupleSetableCriteria> = {
	type: "tuple",
	defaultCriteria: {
		empty: false
	},
	mount(chunk, criteria) {
		for (let i = 0; i < criteria.tuple.length; i++) {
			chunk.push({
				node:  criteria.tuple[i],
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