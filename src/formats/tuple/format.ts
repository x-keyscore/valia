import type { SchemaMountingTask, SchemaCheckingTask } from "../../schema";
import type { TupleVariantCriteria } from "./types";
import type { FormatTemplate } from "../types";
import { formatDefaultCriteria, isMountedCriteria } from "../formats";
import { isArray, isObject } from "../../testers";

export const TupleFormat: FormatTemplate<TupleVariantCriteria> = {
	defaultCriteria: {
		empty: false
	},
	mountCriteria(definedCriteria, mountedCriteria) {
		return (Object.assign(mountedCriteria, formatDefaultCriteria, this.defaultCriteria, definedCriteria));
	},
	getMountingTasks(definedCriteria, mountedCriteria) {
		let mountingTasks: SchemaMountingTask[] = [];

		for (let i = 0; i < definedCriteria.tuple.length; i++) {
			const definedCriteriaItem = definedCriteria.tuple[i];
			if (isMountedCriteria(definedCriteriaItem)) {
				mountedCriteria.tuple[i] = definedCriteriaItem;
			} else {
				mountingTasks.push({
					definedCriteria: definedCriteriaItem,
					mountedCriteria: mountedCriteria.tuple[i]
				});
			}
		}

		return (mountingTasks);
	},
	checkValue(criteria, value) {
		if (!isArray(value)) {
			return ("TYPE_NOT_ARRAY");
		}

		const valueLength = value.length 

		if (!valueLength) {
			return (criteria.empty ? null : "VALUE_EMPTY");
		}
		else if (valueLength < criteria.tuple.length) {
			return ("VALUE_INFERIOR_TUPLE");
		}
		else if (valueLength > criteria.tuple.length) {
			return ("VALUE_SUPERIOR_TUPLE");
		}

		return (null);
	},
	getCheckingTasks(criteria, value) {
		let checkTasks: SchemaCheckingTask[] = [];

		for (let i = 0; i < value.length; i++) {
			checkTasks.push({
				criteria: criteria.tuple[i],
				value: value[i]
			});
		}

		return (checkTasks);
	}
}