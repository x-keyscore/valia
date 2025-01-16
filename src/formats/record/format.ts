import type { SchemaMountingTask, SchemaCheckingTask } from "../../schema";
import type { RecordVariantCriteria } from "./types";
import type { FormatTemplate } from "../types";
import { formatDefaultCriteria, isMountedCriteria } from "../formats";
import { isObject, isPlainObject } from "../../testers";

export const RecordFormat: FormatTemplate<RecordVariantCriteria> = {
	defaultCriteria: {
		empty: true
	},

	mountCriteria(definedCriteria, mountedCriteria) {
		return (Object.assign(mountedCriteria, formatDefaultCriteria, this.defaultCriteria, definedCriteria));
	},
	getMountingTasks(definedCriteria, mountedCriteria) {
		let mountingTasks: SchemaMountingTask[] = [];

		if (isMountedCriteria(definedCriteria.key)) {
			mountedCriteria.key = definedCriteria.key;
		} else {
			mountingTasks.push({
				definedCriteria: definedCriteria.key,
				mountedCriteria: mountedCriteria.key
			});
		}

		if (isMountedCriteria(definedCriteria.value)) {
			mountedCriteria.value = definedCriteria.value;
		} else {
			mountingTasks.push({
				definedCriteria: definedCriteria.value,
				mountedCriteria: mountedCriteria.value
			});
		}

		return (mountingTasks);
	},

	checkValue(criteria, value) {
		if (!isPlainObject(value)) {// WARNING !
			return ("TYPE_NOT_PLAIN_OBJECT");
		}

		const totalKeys = Object.keys(value).length;

		if (totalKeys === 0) {
			return (criteria.empty ? null : "VALUE_EMPTY");
		}
		else if (criteria.min !== undefined && totalKeys < criteria.min) {
			return ("VALUE_INFERIOR_MIN");
		}
		else if (criteria.max !== undefined && totalKeys > criteria.max) {
			return ("VALUE_SUPERIOR_MAX");
		}

		return (null);
	},
	getCheckingTasks(criteria, value) {
		let checkingTasks: SchemaCheckingTask[] = [];
		const keys = Object.keys(value);

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			checkingTasks.push({
				criteria: criteria.key,
				value: key
			});

			checkingTasks.push({
				criteria: criteria.value,
				value: value[key]
			});
		}

		return (checkingTasks);
	},
}