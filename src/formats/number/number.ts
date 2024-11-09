import { isNumber } from "../../testers";
import { AbstractFormat } from "../AbstractFormat";
import { FormatCheckerResult, TemplateCriteria, TemplateContext, PredefinedCriteria } from "../types";

export interface NumberCriteria extends TemplateCriteria<"number"> {
	accept?: RegExp;
	min?: number;
	max?: number;
}

export type NumberContext = TemplateContext<
	NumberCriteria,
	number
>

export class NumberFormat<Criteria extends NumberCriteria> extends AbstractFormat<Criteria> {
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
				error: isCompliant ? null : { code: "NUMBER_IS_UNDEFINED" }
			}
		}
		else if (!isNumber(input)) {
			return {
				error: { code: "NUMBER_NOT_NUMBER" }
			};
		}
		else if (criteria.min !== undefined && input < criteria.min) {
			return {
				error: { code: "NUMBER_TOO_SMALL" }
			}
		}
		else if (criteria.max !== undefined && input > criteria.max) {
			return {
				error: { code: "NUMBER_TOO_BIG" }
			}
		}
		else if (criteria.accept !== undefined) {
			let temp = input.toString();

			if (!criteria.accept.test(temp)) {
				return {
					error: { code: "NUMBER_WRONG_FORMAT" }
				}
			}
		}
		return {
			error: null
		}
	}
}
