import type { SchemaCheckTask, SchemaMountTask } from "../../schema/types";
import type { FormatCheckValueResult, MountedCriteria } from "../types";
import type { SymbolCriteria } from "./types";
import { isBoolean, isSymbol } from "../../testers";
import { AbstractFormat } from "../AbstractFormat";

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
				error: !criteria.require ? null : { code: "SYMBOL_IS_UNDEFINED" }
			}
		}
		else if (!isSymbol(value)) {
			return {
				error: { code: "SYMBOL_NOT_SYMBOL" }
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
