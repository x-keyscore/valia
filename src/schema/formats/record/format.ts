import type { RecordTunableCriteria } from "./types";
import type { FormatTemplate } from "../types";
import { isMountedCriteria } from "../../services/mounter";
import { isPlainObject } from "../../../testers";
import { formats } from "../formats";

export const RecordFormat: FormatTemplate<RecordTunableCriteria> = {
	defaultCriteria: {
		empty: false
	},
	mounting(queue, mapper, definedCriteria, mountedCriteria) {
		if (isMountedCriteria(definedCriteria.key)) {
			mapper.merge(mountedCriteria, definedCriteria.key, {
				pathParts: ["key"]
			});
			mountedCriteria.key = definedCriteria.key;
		} else {
			mapper.add(mountedCriteria, mountedCriteria.key, {
				pathParts: ["key"]
			});
			queue.push({
				definedCriteria: definedCriteria.key,
				mountedCriteria: mountedCriteria.key
			});
		}

		if (isMountedCriteria(definedCriteria.value)) {
			mapper.merge(mountedCriteria, definedCriteria.value, {
				pathParts: ["value"]
			});
		} else {
			mapper.add(mountedCriteria, mountedCriteria.value, {
				pathParts: ["value"]
			});
			queue.push({
				definedCriteria: definedCriteria.value,
				mountedCriteria: mountedCriteria.value
			});
		}
	},
	checking(queue, criteria, value) {
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

			const rejectState = formats[criteriaKey.type].checking([], criteriaKey, key);
			if (rejectState) return (rejectState);

			queue.push({
				criteria: criteriaValue,
				value: value[key]
			});
		}

		return (null);
	}
}