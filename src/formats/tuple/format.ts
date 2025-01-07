import type { SchemaMountTask, SchemaCheckTask } from "../../schema/types";
import type { MountedCriteria, FormatCheckValueResult } from "../types";
import type { TupleCriteria } from "./types";
import { isArray, isObject } from "../../testers";
import { AbstractFormat } from "../AbstractFormat";

export class TupleFormat<Criteria extends TupleCriteria> extends AbstractFormat<Criteria> {
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

	checkValue(
		mountedCriteria: MountedCriteria<Criteria>,
		value: unknown
	): FormatCheckValueResult {
		const criteria = mountedCriteria;

		if (value === undefined) {
			const isCompliant = !criteria.require;
			return {
				error: isCompliant ? null : { code: "TUPLE_IS_UNDEFINED" }
			}
		}
		else if (!isObject(value)) {
			return {
				error: { code: "TUPLE_NOT_OBJECT" }
			}
		}
		else if (!isArray(value)) {
			return {
				error: { code: "TUPLE_NOT_ARRAY" }
			}
		}
		else if (!value.length) {
			return {
				error: criteria.empty ? null : { code: "TUPLE_IS_EMPTY" }
			}
		}
		else if (criteria.min !== undefined && value.length < criteria.min) {
			return {
				error: { code: "TUPLE_INFERIOR_MIN_LENGTH" }
			}
		}
		else if (criteria.max !== undefined && value.length > criteria.max) {
			return {
				error: { code: "TUPLE_SUPERIOR_MAX_LENGTH" }
			}
		}
		else if (criteria.min === undefined && criteria.max === undefined) {
			if (value.length < criteria.tuple.length) {
				return {
					error: { code: "TUPLE_INFERIOR_TUPLE_LENGTH" }
				}
			}
		} else if (value.length > criteria.tuple.length) {
			return {
				error: { code: "TUPLE_SUPERIOR_TUPLE_LENGTH" }
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
				mountedCriteria: mountedCriteria.tuple[i],
				value: value[i]
			});
		}

		return (checkTasks);
	}
}