import type { SchemaMountingTask, SchemaCheckingTask } from "../../schema/types";
import type { CheckValueResult, MountedCriteria } from "../types";
import type { StructCriteria } from "./types";
import { AbstractFormat, isAlreadyMounted } from "../AbstractFormat";
import { isObject, isPlainObject } from "../../testers";

export class StructFormat<Criteria extends StructCriteria> extends AbstractFormat<Criteria> {
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
	): SchemaMountingTask[] {
		let mountingTasks: SchemaMountingTask[] = [];
		const keys = Object.keys(definedCriteria.struct);

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];

			if (isAlreadyMounted(definedCriteria.struct[key])) {
				mountedCriteria.struct[key] = definedCriteria.struct[key];
			} else {
				mountingTasks.push({
					definedCriteria: definedCriteria.struct[key],
					mountedCriteria: mountedCriteria.struct[key]
				});
			}
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
		else if (Object.keys(value).length === 0) {
			return (criteria.empty ? null : "VALUE_EMPTY");
		}
		else if (!this.hasRequiredKeys(criteria, value)) {
			return ("VALUE_MISSING_KEY");
		}
		else if (!this.hasDefinedKeys(criteria, value)) {
			return ("VALUE_INVALID_KEY");
		};

		return null
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
				criteria: criteria.struct[key],
				value: value[key]
			});
		}

		return (checkingTasks);
	}
}