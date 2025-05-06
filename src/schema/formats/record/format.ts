import type { RecordSetableCriteria } from "./types";
import type { Format } from "../types";
import { isPlainObject } from "../../../tests";

export const RecordFormat: Format<RecordSetableCriteria> = {
	type: "record",
	defaultCriteria: {
		empty: true
	},
	mount(chunk, criteria) {
		chunk.push({
			node: criteria.key,
			partPaths: {
				explicit: ["key"],
				implicit: []
			}
		});
		chunk.push({
			node: criteria.value,
			partPaths: {
				explicit: ["value"],
				implicit: ["%", "string", "symbol"]
			}
		});
	},
	check(chunk, criteria, data) {
		if (!isPlainObject(data)) {
			return ("TYPE_PLAIN_OBJECT_REQUIRED");
		}

		const keys = Reflect.ownKeys(data);
		const keysLength = keys.length;

		if (keysLength === 0) {
			return (criteria.empty ? null : "DATA_EMPTY_DISALLOWED");
		}
		else if (criteria.min != null && keysLength < criteria.min) {
			return ("DATA_SIZE_INFERIOR_MIN");
		}
		else if (criteria.max != null && keysLength > criteria.max) {
			return ("DATA_SIZE_SUPERIOR_MAX");
		}

		for (let i = 0; i < keysLength; i++) {
			const key = keys[i];

			chunk.push({
				data: key,
				node: criteria.key
			}, {
				data: data[key],
				node: criteria.value
			});
		}

		return (null);
	}
}