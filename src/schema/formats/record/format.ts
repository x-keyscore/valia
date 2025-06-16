import type { RecordSetableCriteria } from "./types";
import type { Format } from "../types";
import { isPlainObject } from "../../../testers";

export const RecordFormat: Format<RecordSetableCriteria> = {
	type: "record",
	mount(chunk, criteria) {
		Object.assign(criteria, {
			empty: criteria.empty ?? true
		});

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
			return ("TYPE.PLAIN_OBJECT.NOT_SATISFIED");
		}

		const keys = Reflect.ownKeys(data);
		const keysLength = keys.length;

		if (keysLength === 0) {
			return (criteria.empty ? null : "EMPTY.NOT_ALLOWED");
		}
		else if (criteria.min != null && keysLength < criteria.min) {
			return ("MIN.KEYS.NOT_SATISFIED");
		}
		else if (criteria.max != null && keysLength > criteria.max) {
			return ("MAX.KEYS.NOT_SATISFIED");
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