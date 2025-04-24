import type { ArraySetableCriteria } from "./types";
import type { Format } from "../types";
import { isArray } from "../../../testers";

export const ArrayFormat: Format<ArraySetableCriteria> = {
	type: "array",
	defaultCriteria: {
		empty: true
	},
	mount(chunk, criteria) {
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
			return ("TYPE_ARRAY_REQUIRED");
		}

		const dataLength = data.length;
		
		if (!dataLength) {
			return (criteria.empty ? null : "DATA_EMPTY_DISALLOWED");
		}
		else if (criteria.min != null && dataLength < criteria.min) {
			return ("DATA_LENGTH_INFERIOR_MIN");
		}
		else if (criteria.max != null && dataLength > criteria.max) {
			return ("DATA_LENGTH_SUPERIOR_MAX");
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