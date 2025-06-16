import type { ArraySetableCriteria } from "./types";
import type { Format } from "../types";
import { isArray } from "../../../testers";

export const ArrayFormat: Format<ArraySetableCriteria> = {
	type: "array",
	mount(chunk, criteria) {
		Object.assign(criteria, {
			empty: criteria.empty ?? true
		});

		chunk.push({
			node: criteria.item,
			partPaths: {
				explicit: ["item"],
				implicit: ["%", "number"],
			}
		});
	},
	check(chunk, criteria, data) {
		if (!isArray(data)) {
			return ("TYPE.ARRAY.NOT_SATISFIED");
		}

		const dataLength = data.length;
		
		if (!dataLength) {
			return (criteria.empty ? null : "EMPTY.NOT_ALLOWED");
		}
		else if (criteria.min != null && dataLength < criteria.min) {
			return ("MIN.LENGTH.NOT_SATISFIED");
		}
		else if (criteria.max != null && dataLength > criteria.max) {
			return ("MAX.LENGTH.NOT_SATISFIED");
		}

		for (let i = 0; i < dataLength; i++) {
			chunk.push({
				data: data[i],
				node: criteria.item
			});
		}

		return (null);
	}
}