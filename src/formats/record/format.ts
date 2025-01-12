import type { SchemaMountingTask, SchemaCheckingTask } from "../../schema/types";
import type { CheckValueResult, MountedCriteria } from "../types";
import type { RecordCriteria } from "./types";
import { AbstractFormat, isAlreadyMounted } from "../AbstractFormat";
import { isObject, isPlainObject } from "../../testers";

export class RecordFormat<Criteria extends RecordCriteria> extends AbstractFormat<Criteria> {
	constructor() {
		super({
			empty: false
		});
	}

	mountCriteria(
		definedCriteria: Criteria,
		mountedCriteria: MountedCriteria<Criteria>
	): MountedCriteria<Criteria> {
		return (Object.assign(mountedCriteria, this.baseMountedCriteria, definedCriteria));
	}

	getMountingTasks(
		definedCriteria: Criteria,
		mountedCriteria: MountedCriteria<Criteria>
	): SchemaMountingTask[] {
		let mountingTasks: SchemaMountingTask[] = [];

		if (isAlreadyMounted(definedCriteria.key)) {
			mountedCriteria.key = definedCriteria.key;
		} else {
			mountingTasks.push({
				definedCriteria: definedCriteria.key,
				mountedCriteria: mountedCriteria.key
			});
		}

		if (isAlreadyMounted(definedCriteria.value)) {
			mountedCriteria.value = definedCriteria.value;
		} else {
			mountingTasks.push({
				definedCriteria: definedCriteria.value,
				mountedCriteria: mountedCriteria.value
			});
		}

		return (mountingTasks);
	}

	checkValue(
		criteria: MountedCriteria<Criteria>,
		value: unknown
	): CheckValueResult {
		if (value === undefined) {
			return (!criteria.require ? null : "TYPE_UNDEFINED");
		}
		else if (!isObject(value)) {
			return ("TYPE_NOT_OBJECT");
		}
		else if (!isPlainObject(value)) {
			return ("TYPE_NOT_PLAIN_OBJECT");
		}

		const keyCount = Object.keys(value).length;

		if (keyCount === 0) {
			return (criteria.empty ? null : "VALUE_EMPTY");
		}
		else if (criteria.min !== undefined && keyCount < criteria.min) {
			return ("VALUE_INFERIOR_MIN");
		}
		else if (criteria.max !== undefined && keyCount > criteria.max) {
			return ("VALUE_SUPERIOR_MAX");
		}

		return (null);
	}

	getCheckingTasks(
		criteria: MountedCriteria<Criteria>,
		value: any
	): SchemaCheckingTask[] {
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
	}
}