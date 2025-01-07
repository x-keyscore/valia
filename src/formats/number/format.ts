import type { SchemaCheckTask, SchemaMountTask } from "../../schema/types";
import type { FormatCheckValueResult, MountedCriteria } from "../types";
import type { NumberCriteria } from "./types";
import { isNumber } from "../../testers";
import { AbstractFormat } from "../AbstractFormat";

export class NumberFormat<Criteria extends NumberCriteria> extends AbstractFormat<Criteria> {
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
	
	checkValue(
		mountedCriteria: MountedCriteria<Criteria>,
		value: unknown
	): FormatCheckValueResult {
		const criteria = mountedCriteria;

		if (value === undefined) {
			return {
				error: !criteria.require ? null : { code: "NUMBER_IS_UNDEFINED" }
			}
		}
		else if (!isNumber(value)) {
			return {
				error: { code: "NUMBER_NOT_NUMBER" }
			};
		}
		else if (criteria.min !== undefined && value < criteria.min) {
			return {
				error: { code: "NUMBER_TOO_SMALL" }
			}
		}
		else if (criteria.max !== undefined && value > criteria.max) {
			return {
				error: { code: "NUMBER_TOO_BIG" }
			}
		}
		else if (criteria.accept !== undefined) {
			let string = value.toString();

			if (!criteria.accept.test(string)) {
				return {
					error: { code: "NUMBER_NOT_RESPECT_REGEX" }
				}
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
