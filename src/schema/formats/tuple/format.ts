import type { TupleSetableCriteria } from "./types";
import type { Format } from "../types";
import { isArray } from "../../../testers";

export const TupleFormat: Format<TupleSetableCriteria> = {
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
			return ("TYPE_NOT_ARRAY");
		}

		const dataLength = data.length;

		if (dataLength < criteria.tuple.length) {
			return ("DATA_INFERIOR_TUPLE");
		}
		else if (dataLength > criteria.tuple.length) {
			return ("DATA_SUPERIOR_TUPLE");
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