import type { ArraySetableCriteria } from "./types";
import type { FormatTemplate } from "../types";
import { isArray } from "../../../testers";

export const ArrayFormat: FormatTemplate< ArraySetableCriteria> = {
	defaultCriteria: {
		empty: true
	},
	mounting(queue, path, criteria) {
		queue.push({
			prevNode: criteria,
			prevPath: path,
			currNode: criteria.item,
			partPath: {
				explicit: ["item"],
				implicit: ["%", "number"],
			}
		});
	},
	checking(queue, path, criteria, value) {
		if (!isArray(value)) {
			return ("TYPE_NOT_ARRAY");
		}
		else if (!value.length) {
			return (criteria.empty ? null : "VALUE_EMPTY");
		}
		else if (criteria.min !== undefined && value.length < criteria.min) {
			return ("VALUE_INFERIOR_MIN");
		}
		else if (criteria.max !== undefined && value.length > criteria.max) {
			return ("VALUE_SUPERIOR_MAX");
		}

		for (let i = 0; i < value.length; i++) {
			queue.push({
				prevPath: path,
				currNode: criteria.item,
				value: value[i]
			});
		}

		return (null);
	}
}