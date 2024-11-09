import { isString } from "../../testers";
import { AbstractFormat } from "../AbstractFormat";
import { FormatCheckerResult, TemplateCriteria, TemplateContext, PredefinedCriteria } from "../types";

export interface StringCriteria extends TemplateCriteria<"string"> {
	accept?: RegExp;
	min?: number;
	max?: number;
	/**
	 * @default true
	 */
	trim?: boolean;
	/**
	 * @default true
	 */
	empty?: boolean;
}

export type StringContext = TemplateContext<
	StringCriteria,
	string,
	"empty" | "trim"
>

export class StringFormat<Criteria extends StringCriteria> extends AbstractFormat<Criteria> {
	protected predefinedCriteria: PredefinedCriteria<Criteria> = {
		empty: true,
		trim: true
	};

	constructor(criteria: Criteria) {
		super(criteria);
	}

	checker(input: unknown): FormatCheckerResult {
		const criteria = this.criteria;

		if (input === undefined) {
			const isCompliant = !criteria.require;
			return {
				error: isCompliant ? null : { code: "STRING_IS_UNDEFINED" }
			}
		}
		else if (!isString(input)) {
			return {
				error: { code: "STRING_NOT_STRING" }
			};
		}

		let temp = input;
		if (criteria.trim) temp = temp.trim();

		if (!temp.length) {
			const isCompliant = criteria.empty;
			return {
				error: isCompliant ? null : { code: "STRING_IS_EMPTY" }
			}
		}
		else if (criteria.min !== undefined && temp.length < criteria.min) {
			return {
				error: { code: "STRING_TOO_SHORT" }
			}
		}
		else if (criteria.max !== undefined && temp.length > criteria.max) {
			return {
				error: { code: "STRING_TOO_LONG" }
		}
		}
		else if (criteria.accept !== undefined && !criteria.accept.test(temp)) {
			return {
				error: { code: "STRING_WRONG_FORMAT" }
		}
		}
		return {
			error: null
		}
	}
}
