import type { SchemaCheckingTask, SchemaMountingTask } from "../../schema/types";
import type { CheckValueResult, MountedCriteria } from "../types";
import type { NumberCriteria } from "./types";
import { isNumber } from "../../testers";
import { AbstractFormat } from "../AbstractFormat";

export class NumberFormat<Criteria extends NumberCriteria> extends AbstractFormat<Criteria> {
	constructor() {
		super({
			empty: true,
			trim: true
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
		return ([]);
	}
	
	checkValue(
		criteria: MountedCriteria<Criteria>,
		value: unknown
	): CheckValueResult {
		if (value === undefined) {
			return (!criteria.require ? null : "TYPE_UNDEFINED");
		}
		else if (!isNumber(value)) {
			return ("TYPE_NOT_NUMBER");
		}
		else if (criteria.min !== undefined && value < criteria.min) {
			return ("VALUE_SUPERIOR_MIN");
		}
		else if (criteria.max !== undefined && value > criteria.max) {
			return ("VALUE_SUPERIOR_MAX");
		}

		return (null);
	}

	getCheckingTasks(
		criteria: MountedCriteria<Criteria>,
		value: any
	): SchemaCheckingTask[] {
		return ([]);
	}
}
