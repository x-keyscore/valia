import { isObject, isPlainObject } from "../../testers";
import { AbstractFormat} from "../AbstractFormat";
import type { FormatCheckerResult, TemplateCriteria, TemplateContext, FormatsCriteria, PredefinedCriteria, FormatGuard } from "../types";

export interface RecordCriteria extends TemplateCriteria<"record"> {
	record: Record<string, FormatsCriteria>;
}

type NotRequireKeyMap<T extends RecordCriteria['record']> = {
	[P in keyof T]-?: T[P]['require'] extends false ? P : never
}[keyof T];

type NotRequireToOptional<T extends RecordCriteria['record']> =
	Partial<Pick<T, NotRequireKeyMap<T>>> &
	Pick<T, Exclude<keyof T, NotRequireKeyMap<T>>>;

type RecordGuard<T extends FormatsCriteria> =
	T extends RecordCriteria
		? { [K in keyof NotRequireToOptional<T['record']>]: FormatGuard<T['record'][K]> }
		: never

export type RecordContext<T extends FormatsCriteria> = TemplateContext<
	RecordCriteria,
	RecordGuard<T>
>

export class RecordFormat<Criteria extends RecordCriteria> extends AbstractFormat<Criteria> {
	protected predefinedCriteria: PredefinedCriteria<Criteria> = {};

	constructor(criteria: Criteria) {
		super(criteria);
	}

	protected hasRequiredKeys(inputRecord: Record<string, unknown>) {
		const expectedObject = this.criteria.record;
		const requiredKeys = Object.entries(expectedObject)
			.filter(([key, value]) => value.require === true || value.require === undefined)
			.map(([key]) => key);
		const inputKeys = Object.keys(inputRecord);

		for (const key of requiredKeys) {
			if (!inputKeys.includes(key)) return (false)
		}
		return (true);
	}

	protected hasDefinedKeys(inputRecord: Record<string, unknown>) {
		const expectedRecord = this.criteria.record;
		const inputKeys = Object.keys(inputRecord);
		const expectedKeys = Object.keys(expectedRecord);

		for (const key of inputKeys) {
			if (!expectedKeys.includes(key)) return (false)
		}
		return (true);
	}

	checker(input: unknown): FormatCheckerResult {
		const criteria = this.criteria;

		if (input === undefined) {
			const isCompliant = !criteria.require;
			return {
				error: isCompliant ? null : { code: "RECORD_IS_UNDEFINED" }
			}
		}
		else if (!isObject(input)) {
			return {
				error: { code: "RECORD_NOT_OBJECT" }
			}
		}
		else if (!isPlainObject(input)) {
			return {
				error: { code: "RECORD_NOT_PLAIN_OBJECT" }
			}
		}
		else if (!this.hasRequiredKeys(input)) {
			return {
				error: { code: "RECORD_REQUIRE_KEY" }
			}
		}
		else if (!this.hasDefinedKeys(input)) {
			return {
				error: { code: "RECORD_DEFINED_KEY" }
			}
		};
		return {
			error: null
		}
	}
}