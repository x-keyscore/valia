import type { SchemaMountingTask, SchemaCheckingTask } from "../../schema";
import type { UnionVariantCriteria } from "./types";
import type { FormatTemplate } from "../types";
import { formatDefaultCriteria, isAlreadyMounted } from "../formats";

export const UnionFormat: FormatTemplate<UnionVariantCriteria> = {
	defaultCriteria: {
		empty: false
	},

	mountCriteria(definedCriteria, mountedCriteria) {
		return (Object.assign(mountedCriteria, formatDefaultCriteria, this.defaultCriteria, definedCriteria));
	},
	getMountingTasks(definedCriteria, mountedCriteria) {
		let mountingTasks: SchemaMountingTask[] = [];

		for (let i = 0; i < definedCriteria.union.length; i++) {
			const definedCriteriaItem = definedCriteria.union[i];

			if (isAlreadyMounted(definedCriteriaItem)) {
				mountedCriteria.union[i] = definedCriteriaItem;
			} else {
				mountingTasks.push({
					definedCriteria: definedCriteriaItem,
					mountedCriteria: mountedCriteria.union[i]
				});
			}
		}

		return (mountingTasks);
	},
	checkValue(criteria, value) {
		return (null);
	},
	getCheckingTasks(criteria, value) {
		let checkTasks: SchemaCheckingTask[] = [];
		const unionLength = criteria.union.length;

		const link: NonNullable<SchemaCheckingTask['link']> = {
			isClose: false,
			totalLinks: unionLength,
			totalRejected: 0,
		}

		for (let i = 0; i < unionLength; i++) {
			checkTasks.push({
				criteria: criteria.union[i],
				value: value,
				link
			});
		}

		return (checkTasks);
	},
}