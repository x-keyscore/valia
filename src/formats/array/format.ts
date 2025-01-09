import type { SchemaMountTask, SchemaCheckTask } from "../../schema/types";
import type { FormatCheckEntry, MountedCriteria  } from "../types";
import type { ArrayCriteria } from "./types";
import { isArray, isObject } from "../../testers";
import { AbstractFormat } from "../AbstractFormat";

export class ArrayFormat<Criteria extends ArrayCriteria> extends AbstractFormat<Criteria> {
	public type: Criteria["type"] = "array";

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

	checkEntry(
		criteria: MountedCriteria<Criteria>,
		entry: unknown
	): FormatCheckEntry {
		if (entry === undefined) {
			return (!criteria.require ? null : "REJECT_TYPE_UNDEFINED");
		}
		else if (!isObject(entry)) {
			return ("REJECT_TYPE_NOT_OBJECT");
		}
		else if (!isArray(entry)) {
			return ("REJECT_TYPE_NOT_ARRAY");
		}
		else if (!entry.length) {
			return ("REJECT_VALUE_EMPTY");
		}
		else if (criteria.min !== undefined && entry.length < criteria.min) {
			return ("REJECT_VALUE_INFERIOR_MIN");
		}
		else if (criteria.max !== undefined && entry.length > criteria.max) {
			return ("REJECT_VALUE_SUPERIOR_MAX");
		}

		return (null);
	}

	getCheckingTasks(
		criteria: MountedCriteria<Criteria>,
		entry: any
	): SchemaCheckTask[] {
		let checkTasks: SchemaCheckTask[] = [];

		for (let i = 0; i < entry.length; i++) {
			checkTasks.push({
				criteria: criteria.item,
				entry: entry[i]
			});
		}

		return (checkTasks);
	}
}