import type { SchemaCheckTask, SchemaMountTask } from "../../schema/types";
import type { FormatCheckEntry, MountedCriteria } from "../types";
import type { BooleanCriteria } from "./types";
import { isBoolean } from "../../testers";
import { AbstractFormat } from "../AbstractFormat";

export class BooleanFormat<Criteria extends BooleanCriteria> extends AbstractFormat<Criteria> {
	public type: Criteria["type"] = "boolean";

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

	checkEntry(
		criteria: MountedCriteria<Criteria>,
		entry: unknown
	): FormatCheckEntry {
		if (entry === undefined) {
			return (!criteria.require ? null : "REJECT_TYPE_UNDEFINED");
		}
		else if (!isBoolean(entry)) {
			return ("REJECT_TYPE_NOT_BOOLEAN");
		}

		return (null);
	}

	getCheckingTasks(
		criteria: MountedCriteria<Criteria>,
		entry: any
	): SchemaCheckTask[] {
		return ([]);
	}
}
