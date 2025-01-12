import type { SchemaCheckingTask, SchemaMountingTask } from "../../schema/types";
import type { CheckValueResult, MountedCriteria } from "../types";
import type { SymbolCriteria } from "./types";
import { AbstractFormat } from "../AbstractFormat";
import { isSymbol } from "../../testers";

export class SymbolFormat<Criteria extends SymbolCriteria> extends AbstractFormat<Criteria> {
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
		else if (!isSymbol(value)) {
			return "TYPE_NOT_SYMBOL";
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
