import type { SchemaMountTask, SchemaCheckTask } from "../../schema/types";
import type { FormatCheckValueResult, MountedCriteria } from "../types";
import type { RecordCriteria } from "./types";
import { isObject, isPlainObject } from "../../testers";
import { AbstractFormat, isAlreadyMounted } from "../AbstractFormat";

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

	checkValue(
		mountedCriteria: MountedCriteria<Criteria>,
		value: unknown
	): FormatCheckValueResult {
		const criteria = mountedCriteria;

		if (value === undefined) {
			return {
				error: !criteria.require ? null : { code: "RECORD_IS_UNDEFINED" }
			}
		}
		else if (!isObject(value)) {
			return {
				error: { code: "RECORD_NOT_OBJECT" }
			}
		}
		else if (!isPlainObject(value)) {
			return {
				error: { code: "RECORD_NOT_PLAIN_OBJECT" }
			}
		}

		const valueLength = this.objectLength(value);

		if (valueLength === 0) {
			return {
				error: criteria.empty ? null : { code: "RECORD_IS_EMPTY" }
			}
		}
		else if (criteria.min !== undefined && valueLength < criteria.min) {
			return {
				error: { code: "RECORD_INFERIOR_MIN_LENGTH" }
			}
		}
		else if (criteria.max !== undefined && valueLength > criteria.max) {
			return {
				error: { code: "RECORD_SUPERIOR_MAX_LENGTH" }
			}
		}

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
				mountedCriteria: mountedCriteria.key,
				value: key
			});

			checkTasks.push({
				mountedCriteria: mountedCriteria.value,
				value: value[key]
			});
		}

		return (checkTasks);
	}
}