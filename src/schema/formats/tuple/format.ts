import type { TupleSetableCriteria } from "./types";
import type { FormatTemplate } from "../types";
import { isArray } from "../../../testers";

export const TupleFormat: FormatTemplate<TupleSetableCriteria> = {
	defaultCriteria: {
		empty: false
	},
	mounting(queue, path, criteria) {
		for (let i = 0; i < criteria.tuple.length; i++) {
			queue.push({
				prevNode: criteria,
				prevPath: path,
				currNode: criteria.tuple[i],
				partPath: {
					explicit: ["tuple", i],
					implicit: ["&", i]
				}
			});
		}
	},
	checking(queue, path, criteria, value) {
		if (!isArray(value)) {
			return ("TYPE_NOT_ARRAY");
		}

		const valueLength = value.length 

		if (valueLength < criteria.tuple.length) {
			return ("VALUE_INFERIOR_TUPLE");
		}
		else if (valueLength > criteria.tuple.length) {
			return ("VALUE_SUPERIOR_TUPLE");
		}

		for (let i = 0; i < value.length; i++) {
			queue.push({
				prevPath: path,
				currNode: criteria.tuple[i],
				value: value[i]
			});
		}

		return (null);
	}
}