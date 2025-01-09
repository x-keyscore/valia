import type { SchemaCheckTask, SchemaMountTask } from "../../schema/types";
import type { FormatCheckEntry, MountedCriteria } from "../types";
import type { SymbolCriteria } from "./types";
import { isBoolean, isSymbol } from "../../testers";
import { AbstractFormat } from "../AbstractFormat";

export class SymbolFormat<Criteria extends SymbolCriteria> extends AbstractFormat<Criteria> {
	public type: Criteria["type"] = "symbol";

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
		mountedCriteria: MountedCriteria<Criteria>,
		entry: unknown
	): FormatCheckEntry {
		const criteria = mountedCriteria;
	
		if (entry === undefined) {
			return (!criteria.require ? null : "REJECT_TYPE_UNDEFINED");
		}
		else if (!isSymbol(entry)) {
			return "REJECT_TYPE_NOT_SYMBOL";
		}

		return (null);
	}

	getCheckingTasks(
		mountedCriteria: MountedCriteria<Criteria>,
		entry: any
	): SchemaCheckTask[] {
		return ([]);
	}
}
