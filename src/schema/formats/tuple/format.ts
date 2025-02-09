import type { TupleTunableCriteria } from "./types";
import type { FormatTemplate } from "../types";
import { isMountedCriteria } from "../../services/mounter";
import { isArray } from "../../../testers";

export const TupleFormat: FormatTemplate<TupleTunableCriteria> = {
	defaultCriteria: {
		empty: false
	},
	mounting(queue, mapper, definedCriteria, mountedCriteria) {
		for (let i = 0; i < definedCriteria.tuple.length; i++) {
			const definedCriteriaItem = definedCriteria.tuple[i];
			if (isMountedCriteria(definedCriteriaItem)) {
				mapper.merge(mountedCriteria, definedCriteriaItem, {
					pathParts: [`tuple[${i}]`]
				});
				mountedCriteria.tuple[i] = definedCriteriaItem;
			} else {
				mapper.add(mountedCriteria, mountedCriteria.tuple[i], {
					pathParts: [`tuple[${i}]`]
				});
				queue.push({
					definedCriteria: definedCriteriaItem,
					mountedCriteria: mountedCriteria.tuple[i]
				});
			}
		}
	},
	checking(queue, criteria, value) {
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
				criteria: criteria.tuple[i],
				value: value[i]
			});
		}

		return (null);
	}
}