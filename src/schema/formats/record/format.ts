import type { RecordSetableCriteria } from "./types";
import type { Format } from "../types";
import { isPlainObject } from "../../../testers";

export const RecordFormat: Format<RecordSetableCriteria> = {
	defaultCriteria: {
		empty: false
	},
	mount(chunk, criteria) {
		chunk.add({
			node: criteria.key,
			partPaths: {
				explicit: ["key"],
				implicit: []
			}
		})
		chunk.add({
			node: criteria.value,
			partPaths: {
				explicit: ["value"],
				implicit: ["%", "string", "symbol"]
			}
		})
	},
	check(chunk, criteria, value) {
		if (!isPlainObject(value)) {
			return ("TYPE_NOT_PLAIN_OBJECT");
		}

		const keys = Object.keys(value);
		const totalKeys = keys.length;

		if (totalKeys === 0) {
			return (criteria.empty ? null : "VALUE_EMPTY");
		}
		else if (criteria.min !== undefined && totalKeys < criteria.min) {
			return ("VALUE_INFERIOR_MIN");
		}
		else if (criteria.max !== undefined && totalKeys > criteria.max) {
			return ("VALUE_SUPERIOR_MAX");
		}

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];

			chunk.addTask({
				data: key,
				node: criteria.key,
				
			});

			chunk.addTask({
				data: value[key],
				node: criteria.value,
				
			});
		}

		return (null);
	}
}