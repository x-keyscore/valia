import type { SchemaMountingTask, SchemaCheckingTask } from "../../schema/types";
import type { MountedCriteria, CheckValueResult } from "../types";
import type { TupleConcretTypes } from "./types";
import { AbstractFormat, isAlreadyMounted } from "../AbstractFormat";
import { isArray, isObject } from "../../testers";

export class TupleFormat<Criteria extends TupleConcretTypes['criteria']> extends AbstractFormat<Criteria> {
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
	): SchemaMountingTask[] {
		let mountingTasks: SchemaMountingTask[] = [];

		for (let i = 0; i < definedCriteria.tuple.length; i++) {
			const definedCriteriaItem = definedCriteria.tuple[i];
			if (isAlreadyMounted(definedCriteriaItem)) {
				mountedCriteria.tuple[i] = definedCriteriaItem;
			} else {
				mountingTasks.push({
					definedCriteria: definedCriteriaItem,
					mountedCriteria: mountedCriteria.tuple[i]
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
		else if (!isArray(value)) {
			return ("TYPE_NOT_ARRAY");
		}

		const valueLength = value.length 

		if (!valueLength) {
			return (criteria.empty ? null : "VALUE_EMPTY");
		}
		else if (valueLength < criteria.tuple.length) {
			return ("VALUE_INFERIOR_TUPLE");
		}
		else if (valueLength > criteria.tuple.length) {
			return ("VALUE_SUPERIOR_TUPLE");
		}

		return (null);
	}

	getCheckingTasks(
		criteria: MountedCriteria<Criteria>,
		value: any
	): SchemaCheckingTask[] {
		let checkTasks: SchemaCheckingTask[] = [];

		for (let i = 0; i < value.length; i++) {
			checkTasks.push({
				criteria: criteria.tuple[i],
				value: value[i]
			});
		}

		return (checkTasks);
	}
}