import type { SchemaCheckingTask, SchemaMountingTask } from "../../schema/types";
import type { CheckValueResult, MountedCriteria } from "../types";
import type { StringCriteria } from "./types";
import { AbstractFormat } from "../AbstractFormat";
import { testers, isString } from "../../";

export class StringFormat<Criteria extends StringCriteria> extends AbstractFormat<Criteria> {
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
		else if (!isString(value)) {
			return ("TYPE_NOT_STRING");
		}

		let str = value;
		if (criteria.trim) str = str.trim();

		if (!str.length) {
			return (criteria.empty ? null : "VALUE_EMPTY");
		}
		else if (criteria.min !== undefined && str.length < criteria.min) {
			return ("VALUE_INFERIOR_MIN");
		}
		else if (criteria.max !== undefined && str.length > criteria.max) {
			return ("VALUE_SUPERIOR_MAX");
		}
		else if (criteria.regex !== undefined && !criteria.regex.test(str)) {
			return ("TEST_REGEX_FAILED");
		} else if (criteria.test && !testers.string[criteria.test.name](str, criteria.test?.params as any)) {
			return ("TEST_STRING_FAILED");
		} else if (criteria.custom && !criteria.custom(str)) {
			return ("TEST_CUSTOM_FAILED");
		}

		return null;
	}

	getCheckingTasks(
		criteria: MountedCriteria<Criteria>,
		value: any
	): SchemaCheckingTask[] {
		return ([]);
	}
}
