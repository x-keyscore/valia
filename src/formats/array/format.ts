import type { SchemaMountingTask, SchemaCheckingTask } from "../../schema/types";
import type { CheckValueResult, MountedCriteria  } from "../types";
import type { ArrayCriteria } from "./types";
import { AbstractFormat, isAlreadyMounted } from "../AbstractFormat";
import { isArray, isObject } from "../../testers";

export class ArrayFormat<Criteria extends ArrayCriteria> extends AbstractFormat<Criteria> {
	constructor() {
		super({
			empty: true
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

		if (isAlreadyMounted(definedCriteria.item)) {
			mountedCriteria.item = definedCriteria.item;
		} else {
			mountingTasks.push({
				definedCriteria: definedCriteria.item,
				mountedCriteria: mountedCriteria.item
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
		else if (!isArray(value)) {
			return ("TYPE_NOT_ARRAY");
		}
		else if (!value.length) {
			return ("VALUE_EMPTY");
		}
		else if (criteria.min !== undefined && value.length < criteria.min) {
			return ("VALUE_INFERIOR_MIN");
		}
		else if (criteria.max !== undefined && value.length > criteria.max) {
			return ("VALUE_SUPERIOR_MAX");
		}

		return (null);
	}

	getCheckingTasks(
		criteria: MountedCriteria<Criteria>,
		value: any
	): SchemaCheckingTask[] {
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