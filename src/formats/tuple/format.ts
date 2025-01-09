import type { SchemaMountTask, SchemaCheckTask } from "../../schema/types";
import type { MountedCriteria, FormatCheckEntry } from "../types";
import type { TupleCriteria } from "./types";
import { isArray, isObject } from "../../testers";
import { AbstractFormat } from "../AbstractFormat";

export class TupleFormat<Criteria extends TupleCriteria> extends AbstractFormat<Criteria> {
	public type: Criteria["type"] = "tuple";

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
	): SchemaMountTask[] {
		let buildTasks: SchemaMountTask[] = [];

		for (let i = 0; i < definedCriteria.tuple.length; i++) {
			buildTasks.push({
				definedCriteria: definedCriteria.tuple[i],
				mountedCriteria: mountedCriteria.tuple[i]
			});
		}

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

		const entryLength = entry.length 

		if (!entryLength) {
			return (criteria.empty ? null : "REJECT_VALUE_EMPTY");
		}
		else if (criteria.min !== undefined && entryLength < criteria.min) {
			return ("REJECT_VALUE_INFERIOR_MIN");
		}
		else if (criteria.max !== undefined && entryLength > criteria.max) {
			return ("REJECT_VALUE_SUPERIOR_MAX");
		}
		else if (criteria.min === undefined && criteria.max === undefined) {
			if (entryLength < criteria.tuple.length) {
				return ("REJECT_VALUE_INFERIOR_TUPLE");
			}
		} else if (entryLength > criteria.tuple.length) {
			return ("REJECT_VALUE_SUPERIOR_TUPLE");
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
				criteria: criteria.tuple[i],
				entry: entry[i]
			});
		}

		return (checkTasks);
	}
}