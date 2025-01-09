import type { SchemaCheckTask, SchemaMountTask } from "../../schema/types";
import type { FormatCheckEntry, MountedCriteria } from "../types";
import type { StringCriteria } from "./types";
import { AbstractFormat } from "../AbstractFormat";
import { isString } from "../../testers";
import { testers } from "../../";

export class StringFormat<Criteria extends StringCriteria> extends AbstractFormat<Criteria> {
	public type: Criteria["type"] = "string";

	constructor() {
		super({
			empty: true,
			trim: false
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
		mountedCriteria: MountedCriteria<Criteria>,
		entry: unknown
	): FormatCheckEntry {
		const criteria = mountedCriteria;
	
		if (entry === undefined) {
			return (!criteria.require ? null : "REJECT_TYPE_UNDEFINED");
		}
		else if (!isString(entry)) {
			return ("REJECT_TYPE_NOT_STRING");
		}

		let str = entry;
		if (criteria.trim) str = str.trim();

		if (!str.length) {
			return (criteria.empty ? null : "REJECT_VALUE_EMPTY");
		}
		else if (criteria.min !== undefined && str.length < criteria.min) {
			return ("REJECT_VALUE_TOO_SHORT");
		}
		else if (criteria.max !== undefined && str.length > criteria.max) {
			return ("REJECT_VALUE_TOO_LONG");
		}
		else if (criteria.regex !== undefined && !criteria.regex.test(str)) {
			return ("REJECT_TEST_REGEX");
		} else if (criteria.test && !testers.string[criteria.test.name](str, criteria.test?.params as any)) {
			return ("REJECT_TEST_STRING");
		} else if (criteria.custom && !criteria.custom(str)) {
			return ("REJECT_TEST_CUSTOM");
		}

		return null;
	}

	getCheckingTasks(
		criteria: MountedCriteria<Criteria>,
		entry: any
	): SchemaCheckTask[] {
		return ([]);
	}
}
