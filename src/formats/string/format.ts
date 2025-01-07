import type { SchemaCheckTask, SchemaMountTask } from "../../schema/types";
import type { FormatCheckValueResult, MountedCriteria } from "../types";
import type { StringCriteria } from "./types";
import { AbstractFormat } from "../AbstractFormat";
import { isString, strings } from "../../testers";

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
				error: !criteria.require ? null : { code: "STRING_IS_UNDEFINED" }
			}
		}
		else if (!isString(value)) {
			return {
				error: { code: "STRING_NOT_STRING" }
			};
		}

		let str = value;
		if (criteria.trim) str = str.trim();

		if (!str.length) {
			return {
				error: criteria.empty ? null : { code: "STRING_IS_EMPTY" }
			}
		}
		else if (criteria.min !== undefined && str.length < criteria.min) {
			return {
				error: { code: "STRING_TOO_SHORT" }
			}
		}
		else if (criteria.max !== undefined && str.length > criteria.max) {
			return {
				error: { code: "STRING_TOO_LONG" }
			}
		}
		else if (criteria.accept !== undefined && !criteria.accept.test(str)) {
			return {
				error: { code: "STRING_NOT_RESPECT_REGEX" }
			}
		} else if (criteria.kind && !strings[criteria.kind.name](str, criteria.kind.params as any)) {
			return {
				error: { code: "STRING_NOT_RESPECT_KIND" }
			}
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
