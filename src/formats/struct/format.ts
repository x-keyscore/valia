import type { SchemaMountTask, SchemaCheckTask } from "../../schema/types";
import type { FormatCheckValueResult, MountedCriteria } from "../types";
import type { StructCriteria } from "./types";
import { isObject, isPlainObject } from "../../testers";
import { AbstractFormat } from "../AbstractFormat";

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

	objectLength(obj: object): number {
		return (Object.keys(obj).length + Object.getOwnPropertySymbols(obj).length);
	}

	checkValue(
		mountedCriteria: MountedCriteria<Criteria>,
		value: unknown
	): FormatCheckValueResult {
		const criteria = mountedCriteria;

		if (value === undefined) {
			return {
				error: !criteria.require ? null : { code: "STRUCT_IS_UNDEFINED" }
			}
		}
		else if (!isObject(value)) {
			return {
				error: { code: "STRUCT_NOT_OBJECT" }
			}
		}
		else if (!isPlainObject(value)) {
			return {
				error: { code: "STRUCT_NOT_PLAIN_OBJECT" }
			}
		}
		else if (this.objectLength(value) === 0) {
			return {
				error: criteria.empty ? null : { code: "STRUCT_IS_EMPTY" }
			}
		}
		else if (!this.hasRequiredKeys(criteria, value)) {
			return {
				error: { code: "STRUCT_REQUIRE_KEY" }
			}
		}
		else if (!this.hasDefinedKeys(criteria, value)) {
			return {
				error: { code: "STRUCT_DEFINED_KEY" }
			}
		};

		return {
			error: null
		}
	}

	getCheckingTasks(
		mountedCriteria: MountedCriteria<Criteria>,
		value: any
	): SchemaCheckTask[] {
		let checkTasks: SchemaCheckTask[] = [];
		const keys = Object.keys(value);

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			checkTasks.push({
				mountedCriteria: mountedCriteria.struct[key],
				value: value[key]
			});
		}

		return (checkTasks);
	}
}