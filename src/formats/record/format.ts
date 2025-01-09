import type { SchemaMountTask, SchemaCheckTask } from "../../schema/types";
import type { FormatCheckEntry, MountedCriteria } from "../types";
import type { RecordCriteria } from "./types";
import { isObject, isPlainObject } from "../../testers";
import { AbstractFormat, isAlreadyMounted } from "../AbstractFormat";

export class RecordFormat<Criteria extends RecordCriteria> extends AbstractFormat<Criteria> {
	public type: Criteria["type"] = "record";

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

		buildTasks.push({
			definedCriteria: definedCriteria.key,
			mountedCriteria: mountedCriteria.key
		});

		if (isAlreadyMounted(definedCriteria.value)) {
			mountedCriteria.value = definedCriteria.value;
		} else {
			buildTasks.push({
				definedCriteria: definedCriteria.value,
				mountedCriteria: mountedCriteria.value
			});
		}

		return (buildTasks);
	}

	objectLength(obj: object): number {
		return (Object.keys(obj).length + Object.getOwnPropertySymbols(obj).length);
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
		else if (!isPlainObject(entry)) {
			return ("REJECT_TYPE_NOT_PLAIN_OBJECT");
		}

		const numberKeys = Object.keys(entry).length;

		if (numberKeys === 0) {
			return ("REJECT_VALUE_EMPTY");
		}
		else if (criteria.min !== undefined && numberKeys < criteria.min) {
			return ("REJECT_VALUE_INFERIOR_MIN");
		}
		else if (criteria.max !== undefined && numberKeys > criteria.max) {
			return ("REJECT_VALUE_SUPERIOR_MAX");
		}

		return (null);
	}

	getCheckingTasks(
		criteria: MountedCriteria<Criteria>,
		entry: any
	): SchemaCheckTask[] {
		let checkTasks: SchemaCheckTask[] = [];
		const keys = Object.keys(entry);

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			checkTasks.push({
				criteria: criteria.key,
				entry: key
			});

			checkTasks.push({
				criteria: criteria.value,
				entry: entry[key]
			});
		}

		return (checkTasks);
	}
}