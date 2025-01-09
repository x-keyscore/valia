import type { SchemaMountTask, SchemaCheckTask } from "../../schema/types";
import type { FormatCheckEntry, MountedCriteria } from "../types";
import type { StructCriteria } from "./types";
import { isObject, isPlainObject } from "../../testers";
import { AbstractFormat } from "../AbstractFormat";

export class StructFormat<Criteria extends StructCriteria> extends AbstractFormat<Criteria> {
	public type: Criteria["type"] = "struct";

	constructor() {
		super({
			empty: false
		});
	}

	protected hasRequiredKeys(
		mountedCriteria: MountedCriteria<Criteria>,
		value: Record<string, unknown>
	) {
		const requiredKeys = mountedCriteria.requiredKeys;
		const inputKeys = Object.keys(value);

		for (const key of requiredKeys) {
			if (!inputKeys.includes(key)) return (false)
		}
		return (true);
	}

	protected hasDefinedKeys(
		mountedCriteria: MountedCriteria<Criteria>,
		value: Record<string, unknown>
	) {
		const definedKeys = mountedCriteria.definedKeys;
		const inputKeys = Object.keys(value);

		for (const key of inputKeys) {
			if (!definedKeys.includes(key)) return (false)
		}
		return (true);
	}

	mountCriteria(
		definedCriteria: Criteria,
		mountedCriteria: MountedCriteria<Criteria>
	): MountedCriteria<Criteria> {
		const requiredKeys = Object.entries(definedCriteria.struct)
			.filter(([key, criteria]) => criteria.require !== false)
			.map(([key]) => key);
		const definedKeys = Object.keys(definedCriteria.struct);

		return (Object.assign(mountedCriteria, this.baseMountedCriteria, definedCriteria, { requiredKeys, definedKeys }));
	}

	getMountingTasks(
		definedCriteria: Criteria,
		mountedCriteria: MountedCriteria<Criteria>
	): SchemaMountTask[] {
		let buildTasks: SchemaMountTask[] = [];
		const keys = Object.keys(definedCriteria.struct);

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];

			buildTasks.push({
				definedCriteria: definedCriteria.struct[key],
				mountedCriteria: mountedCriteria.struct[key]
			});
		}

		return (buildTasks);
	}

	checkEntry(
		mountedCriteria: MountedCriteria<Criteria>,
		entry: unknown
	): FormatCheckEntry {
		const criteria = mountedCriteria;

		if (entry === undefined) {
			return (!criteria.require ? null : "REJECT_TYPE_UNDEFINED");
		}
		else if (!isObject(entry)) {
			return ("REJECT_TYPE_NOT_OBJECT");
		}
		else if (!isPlainObject(entry)) {
			return ("REJECT_TYPE_NOT_PLAIN_OBJECT");
		}
		else if (Object.keys(entry).length === 0) {
			return (criteria.empty ? null : "REJECT_VALUE_EMPTY");
		}
		else if (!this.hasRequiredKeys(criteria, entry)) {
			return ("REJECT_VALUE_MISSING_KEY");
		}
		else if (!this.hasDefinedKeys(criteria, entry)) {
			return ("REJECT_VALUE_INVALID_KEY");
		};

		return null
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
				criteria: criteria.struct[key],
				entry: entry[key]
			});
		}

		return (checkTasks);
	}
}