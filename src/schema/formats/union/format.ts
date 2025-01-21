import type { SchemaCheckingTask } from "../../types";
import type { UnionVariantCriteria } from "./types";
import type { FormatTemplate } from "../types";
import { isMountedCriteria } from "../../mounter";

export const UnionFormat: FormatTemplate<UnionVariantCriteria> = {
	defaultCriteria: {
		empty: false
	},
	mounting(queue, register, definedCriteria, mountedCriteria) {
		for (let i = 0; i < definedCriteria.union.length; i++) {
			const definedCriteriaItem = definedCriteria.union[i];

			if (isMountedCriteria(definedCriteriaItem)) {
				register.merge(mountedCriteria, definedCriteriaItem, {
					pathParts: [`union[${i}]`]
				});
				mountedCriteria.union[i] = definedCriteriaItem;
			} else {
				register.add(mountedCriteria, mountedCriteria.union[i], {
					pathParts: [`union[${i}]`]
				});
				queue.push({
					definedCriteria: definedCriteriaItem,
					mountedCriteria: mountedCriteria.union[i]
				});
			}
		}
	},
	checking(queue, criteria, value) {
		const unionLength = criteria.union.length;

		const link: NonNullable<SchemaCheckingTask['link']> = {
			finished: false,
			totalLinks: unionLength,
			totalRejected: 0,
		}

		for (let i = 0; i < unionLength; i++) {
			queue.push({
				criteria: criteria.union[i],
				value,
				link
			});
		}

		return (null);
	}
}