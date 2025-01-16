import type { SchemaMountingTask, SchemaCheckingTask } from "../../schema";
import type { ArrayVariantCriteria } from "./types";
import type { FormatTemplate  } from "../types";
import { formatDefaultCriteria, isMountedCriteria } from "../formats";
import { isArray, isObject } from "../../testers";

export const ArrayFormat: FormatTemplate<ArrayVariantCriteria> = {
	defaultCriteria: {
		empty: true
	},
	mountCriteria(definedCriteria, mountedCriteria) {
		return (Object.assign(mountedCriteria,formatDefaultCriteria, this.defaultCriteria, definedCriteria));
	},
	getMountingTasks(definedCriteria, mountedCriteria) {
		let mountingTasks: SchemaMountingTask[] = [];

		if (isMountedCriteria(definedCriteria.item)) {
			mountedCriteria.item = definedCriteria.item;
		} else {
			mountingTasks.push({
				definedCriteria: definedCriteria.item,
				mountedCriteria: mountedCriteria.item
			});
		}

		return (mountingTasks);
	},
	checkValue(criteria, value) {
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

		return (null);
	},
	getCheckingTasks(criteria, value) {
		let checkingTasks: SchemaCheckingTask[] = [];

		for (let i = 0; i < value.length; i++) {
			checkingTasks.push({
				criteria: criteria.item,
				value: value[i]
			});
		}

		return (checkingTasks);
	}
}