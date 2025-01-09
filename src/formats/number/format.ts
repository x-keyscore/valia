import type { SchemaCheckTask, SchemaMountTask } from "../../schema/types";
import type { FormatCheckEntry, MountedCriteria } from "../types";
import type { NumberCriteria } from "./types";
import { isNumber } from "../../testers";
import { AbstractFormat } from "../AbstractFormat";

export class NumberFormat<Criteria extends NumberCriteria> extends AbstractFormat<Criteria> {
	public type: Criteria["type"] = "number";

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
		else if (!isNumber(entry)) {
			return ("REJECT_TYPE_NOT_NUMBER");
		}
		else if (criteria.min !== undefined && entry < criteria.min) {
			return ("REJECT_VALUE_TOO_SMALL");
		}
		else if (criteria.max !== undefined && entry > criteria.max) {
			return ("REJECT_VALUE_TOO_BIG");
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
