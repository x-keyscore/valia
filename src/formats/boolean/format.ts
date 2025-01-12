import type { SchemaCheckingTask, SchemaMountingTask } from "../../schema/types";
import type { CheckValueResult, MountedCriteria } from "../types";
import type { BooleanCriteria } from "./types";
import { isBoolean } from "../../testers";
import { AbstractFormat } from "../AbstractFormat";

export class BooleanFormat<Criteria extends BooleanCriteria> extends AbstractFormat<Criteria> {
	constructor() {
		super({});
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
		else if (!isBoolean(value)) {
			return ("TYPE_NOT_BOOLEAN");
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
