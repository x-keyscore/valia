import type { RecordSetableCriteria } from "./types";
import type { FormatTemplate } from "../types";
import { isPlainObject } from "../../../testers";

export const RecordFormat: FormatTemplate<RecordSetableCriteria> = {
	defaultCriteria: {
		empty: false
	},
	mounting(queue, path, criteria) {
		queue.push({
			prevCriteria: criteria,
			prevPath: path,
			criteria: criteria.key,
			pathSegments: {
				explicit: ["key"],
				implicit: []
			}
		}, {
			prevCriteria: criteria,
			prevPath: path,
			criteria: criteria.value,
			pathSegments: {
				explicit: ["value"],
				implicit: ["%", "string", "symbol"]
			}
		});
	},
	checking(queue, path, criteria, value) {
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

		const criteriaKey = criteria.key;
		const criteriaValue = criteria.value;
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];

			queue.push({
				prevPath: path,
				criteria: criteriaKey,
				value: key
			});

			queue.push({
				prevPath: path,
				criteria: criteriaValue,
				value: value[key]
			});
		}

		return (null);
	}
}