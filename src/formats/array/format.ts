import type { SchemaMountTask, SchemaCheckTask } from "../../schema/types";
import type { MountedCriteria, FormatCheckValueResult } from "../types";
import type { ArrayCriteria } from "./types";
import { isArray, isObject } from "../../testers";
import { AbstractFormat } from "../AbstractFormat";

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
	): SchemaMountTask[] {
		let buildTasks: SchemaMountTask[] = [{
			definedCriteria: definedCriteria.item,
			mountedCriteria: mountedCriteria.item
		}];

		return (buildTasks);
	}

	checkValue(
		mountedCriteria: MountedCriteria<Criteria>,
		value: unknown
	): FormatCheckValueResult {
		const criteria = mountedCriteria;

		if (value === undefined) {
			const isCompliant = !criteria.require;
			return {
				error: isCompliant ? null : { code: "ARRAY_IS_UNDEFINED" }
			}
		}
		else if (!isObject(value)) {
			return {
				error: { code: "ARRAY_NOT_OBJECT" }
			}
		}
		else if (!isArray(value)) {
			return {
				error: { code: "ARRAY_NOT_ARRAY" }
			}
		}
		else if (!value.length) {
			return {
				error: criteria.empty ? null : { code: "ARRAY_IS_EMPTY" }
			}
		}
		else if (criteria.min !== undefined && value.length < criteria.min) {
			return {
				error: { code: "ARRAY_INFERIOR_MIN_LENGTH" }
			}
		}
		else if (criteria.max !== undefined && value.length > criteria.max) {
			return {
				error: { code: "ARRAY_SUPERIOR_MAX_LENGTH" }
			}
		}

		return { error: null }
	}

	getCheckingTasks(
		mountedCriteria: MountedCriteria<Criteria>,
		value: any
	): SchemaCheckTask[] {
		let checkTasks: SchemaCheckTask[] = [];

		for (let i = 0; i < value.length; i++) {
			checkTasks.push({
				mountedCriteria: mountedCriteria.item,
				value: value[i]
			});
		}

		return (checkTasks);
	}
}