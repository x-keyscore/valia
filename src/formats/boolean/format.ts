import type { SchemaCheckTask, SchemaMountTask } from "../../schema/types";
import type { FormatCheckValueResult, MountedCriteria } from "../types";
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
	): SchemaMountTask[] {
		return ([]);
	}

	checkValue(
		mountedCriteria: MountedCriteria<Criteria>,
		value: unknown
	): FormatCheckValueResult {
		const criteria = mountedCriteria;
	
		if (value === undefined) {
			return {
				error: !criteria.require ? null : { code: "BOOLEAN_IS_UNDEFINED" }
			}
		}
		else if (!isBoolean(value)) {
			return {
				error: { code: "BOOLEAN_NOT_BOOLEAN" }
			};
		}

		return {
			error: null
		}
	}

	getCheckingTasks(
		mountedCriteria: MountedCriteria<Criteria>,
		value: any
	): SchemaCheckTask[] {
		return ([]);
	}
}
