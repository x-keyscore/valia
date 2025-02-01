import type { ArrayVariantCriteria } from "./types";
import type { FormatTemplate  } from "../types";
import { isMountedCriteria } from "../../mounter";
import { isArray } from "../../../testers";

export const ArrayFormat: FormatTemplate<ArrayVariantCriteria> = {
	defaultCriteria: {
		empty: true
	},
	mounting(queue, mapper, definedCriteria, mountedCriteria) {
		if (isMountedCriteria(definedCriteria.item)) {
			mapper.merge(mountedCriteria, definedCriteria.item, {
				pathParts: ["item"]
			});
			mountedCriteria.item = definedCriteria.item;
		} else {
			mapper.add(mountedCriteria, mountedCriteria.item, {
				pathParts: ["item"]
			});
			queue.push({
				definedCriteria: definedCriteria.item,
				mountedCriteria: mountedCriteria.item
			});
		}
	},
	checking(queue, criteria, value) {
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
				criteria: criteria.item,
				value: value[i]
			});
		}

		return (null);
	}
}